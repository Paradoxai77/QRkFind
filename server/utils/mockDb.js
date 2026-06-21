const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');

const DB_FILE = path.join(__dirname, '../uploads/db.json');

// Initialize local JSON DB
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const uploadsDir = path.dirname(DB_FILE);
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], items: [], foundreports: [] }, null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    return { users: [], items: [], foundreports: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Deep clone to avoid mutating local DB objects directly in queries
const clone = (obj) => JSON.parse(JSON.stringify(obj));

function wrapDoc(doc, collectionName) {
  if (!doc) return null;
  const cloned = clone(doc);
  return {
    ...cloned,
    save: async function() {
      const db = readDb();
      const coll = db[collectionName] || [];
      const idx = coll.findIndex(d => d._id === this._id);
      if (idx !== -1) {
        const updatedDoc = { ...this };
        delete updatedDoc.save;
        delete updatedDoc.collectionName;
        coll[idx] = updatedDoc;
        db[collectionName] = coll;
        writeDb(db);
      }
      return this;
    }
  };
}

class QueryChain {
  constructor(results, isSingle = false, collectionName) {
    this.results = results; // Always an array internally
    this.isSingle = isSingle;
    this.collectionName = collectionName;
  }

  sort(sortObj) {
    if (this.isSingle || !sortObj) return this;
    const field = Object.keys(sortObj)[0];
    const order = sortObj[field];
    this.results.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (valA < valB) return order === 1 ? -1 : 1;
      if (valA > valB) return order === 1 ? 1 : -1;
      return 0;
    });
    return this;
  }

  select(selectStr) {
    if (!selectStr) return this;
    const fields = selectStr.split(' ');
    const exclude = fields.some(f => f.startsWith('-'));

    const applySelect = (item) => {
      if (!item) return null;
      const newItem = { ...item };
      if (exclude) {
        const excludeFields = fields.map(f => f.substring(1));
        excludeFields.forEach(f => {
          delete newItem[f];
        });
      } else {
        const keptFields = fields;
        Object.keys(newItem).forEach(k => {
          if (!keptFields.includes(k) && k !== '_id') {
            delete newItem[k];
          }
        });
      }
      return newItem;
    };

    this.results = this.results.map(applySelect);
    return this;
  }

  populate(field, selectFields) {
    if (field === 'item') {
      const items = readDb().items || [];
      this.results = this.results.map(report => {
        if (!report) return null;
        const itemDoc = items.find(i => i._id === report.item || i.itemId === report.itemId);
        let populatedItem = itemDoc ? { ...itemDoc } : null;
        if (populatedItem && selectFields) {
          const keptFields = selectFields.split(' ');
          const filteredItem = {};
          keptFields.forEach(f => {
            filteredItem[f] = populatedItem[f];
          });
          filteredItem._id = populatedItem._id;
          populatedItem = filteredItem;
        }
        return {
          ...report,
          item: populatedItem
        };
      });
    }
    return this;
  }

  then(resolve, reject) {
    try {
      const finalResult = this.isSingle
        ? (this.results[0] ? wrapDoc(this.results[0], this.collectionName) : null)
        : this.results.map(r => wrapDoc(r, this.collectionName));
      resolve(finalResult);
    } catch (err) {
      reject(err);
    }
  }

  async catch(reject) {
    const finalResult = this.isSingle
      ? (this.results[0] ? wrapDoc(this.results[0], this.collectionName) : null)
      : this.results.map(r => wrapDoc(r, this.collectionName));
    return finalResult;
  }
}

function matchQuery(doc, query) {
  for (const key in query) {
    const val = query[key];
    if (val && typeof val === 'object' && val.$in) {
      const mappedIn = val.$in.map(v => v?.toString());
      if (!mappedIn.includes(doc[key]?.toString())) return false;
    } else if (doc[key]?.toString() !== val?.toString()) {
      return false;
    }
  }
  return true;
}

function createModel(collectionName) {
  const getCollection = () => {
    const db = readDb();
    return db[collectionName] || [];
  };
  const saveCollection = (coll) => {
    const db = readDb();
    db[collectionName] = coll;
    writeDb(db);
  };

  return {
    find: function(query = {}) {
      const coll = getCollection();
      const matched = coll.filter(doc => matchQuery(doc, query)).map(d => ({ ...d, collectionName }));
      return new QueryChain(matched, false, collectionName);
    },

    findOne: function(query = {}) {
      const coll = getCollection();
      const found = coll.find(doc => matchQuery(doc, query));
      const matched = found ? [ { ...found, collectionName } ] : [];
      return new QueryChain(matched, true, collectionName);
    },

    findById: function(id) {
      const coll = getCollection();
      const found = coll.find(doc => doc._id === id);
      const matched = found ? [ { ...found, collectionName } ] : [];
      return new QueryChain(matched, true, collectionName);
    },

    create: async function(data) {
      const coll = getCollection();
      const newDoc = {
        _id: nanoid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      coll.push(newDoc);
      saveCollection(coll);
      return wrapDoc({ ...newDoc, collectionName }, collectionName);
    },

    findByIdAndUpdate: function(id, update, options = {}) {
      const coll = getCollection();
      const idx = coll.findIndex(doc => doc._id === id);
      if (idx === -1) return new QueryChain([], true, collectionName);
      
      const updatePayload = update.$set ? { ...update, ...update.$set } : update;
      delete updatePayload.$set;

      const updated = { ...coll[idx], ...updatePayload, updatedAt: new Date().toISOString() };
      coll[idx] = updated;
      saveCollection(coll);
      
      return new QueryChain([ { ...updated, collectionName } ], true, collectionName);
    },

    findOneAndUpdate: function(query, update, options = {}) {
      const coll = getCollection();
      const idx = coll.findIndex(doc => matchQuery(doc, query));
      if (idx === -1) return new QueryChain([], true, collectionName);

      const updatePayload = update.$set ? { ...update, ...update.$set } : update;
      delete updatePayload.$set;

      const updated = { ...coll[idx], ...updatePayload, updatedAt: new Date().toISOString() };
      coll[idx] = updated;
      saveCollection(coll);
      
      return new QueryChain([ { ...updated, collectionName } ], true, collectionName);
    },

    findOneAndDelete: async function(query) {
      const coll = getCollection();
      const idx = coll.findIndex(doc => matchQuery(doc, query));
      if (idx === -1) return null;
      const deleted = coll.splice(idx, 1)[0];
      saveCollection(coll);
      return wrapDoc({ ...deleted, collectionName }, collectionName);
    },

    findByIdAndDelete: async function(id) {
      const coll = getCollection();
      const idx = coll.findIndex(doc => doc._id === id);
      if (idx === -1) return null;
      const deleted = coll.splice(idx, 1)[0];
      saveCollection(coll);
      return wrapDoc({ ...deleted, collectionName }, collectionName);
    },

    deleteMany: async function(query) {
      const coll = getCollection();
      const remaining = coll.filter(doc => !matchQuery(doc, query));
      saveCollection(remaining);
      return { deletedCount: coll.length - remaining.length };
    }
  };
}

module.exports = {
  User: createModel('users'),
  Item: createModel('items'),
  FoundReport: createModel('foundreports'),
  isMock: true
};
