"use strict";

/**
 * The implementation of DataAccessor, for `train`, `test` and `evaluate`
 */
class Accessor {
  constructor(data) {
    this.data = data;
  }
  // read single sample
  next() {
    throw new TypeError('not implemented');
  }
  // read data from source, return array of sample or null if no more data
  nextBatch(batchSize) {
    throw new TypeError('not implemented');
  }
  // seek position
  seek(pos) {
    throw new TypeError('not implemented');
  }
}
class DataSource {
  constructor(url) {
    this.url = url;
  }
  /**
   * construct data accessor here
   *   this.test = new Accessor(this.yourData.test);
   *   this.train = new Accessor(this.yourData.train);
   *   this.evaluate = new Accessor([]);
   */
  async init() {
    throw new TypeError('not implemented');
  }
  async getDataSourceMeta() {
    throw new TypeError('not implemented');
  }
}
/**
 * This is the entry of datasource script
 */
const datasourceEntry = async (option) => {
  const { url = '' } = option;
  if (!url) {
    throw new TypeError('url should be defined');
  }
  /**
   * return instance of DataSourceApi, this is a sample for Table
   */
  const dataSource = new DataSource(url);
  // prepare data here
  await dataSource.init();
  return dataSource;
};

exports.default = datasourceEntry;
