import { DataSourceEntry } from '@pipcook/core';
import { Dataset as DatacookDataset } from '@pipcook/datacook';

type Sample<T> = DatacookDataset.Types.Sample<T>;
type Dataset<T extends DatacookDataset.Types.Sample<any>, D extends DatacookDataset.Types.DatasetMeta> = DatacookDataset.Types.Dataset<T, D>;
type DataSourceMeta = DatacookDataset.Types.TableDatasetMeta;
type DataAccessor<T> = DatacookDataset.Types.DataAccessor<T>;

/**
 * the type of current datasource sample
 */
type MySample = Sample<Array<number>>;

/**
 * The options for current script
 */
interface ScriptOption {
  // All the option could be undefined if user not passed in, so we should define it to be optional.
  url?: string;
}
/**
 * The options for current script
 */
interface ScriptOption {
  // All the option could be undefined if user not passed in, so we should define it to be optional.
  url?: string;
}

/**
 * The implementation of DataAccessor, for `train`, `test` and `evaluate`
 */
class DataAccessorImpl implements DataAccessor<MySample> {
  constructor(
    private data: any
  ) {}

  // read single sample
  async next(): Promise<MySample> {
    throw new TypeError('not implemented');
  }

  // read data from source, return array of sample or null if no more data
  async nextBatch(batchSize: number): Promise<Array<MySample> | null> {
    throw new TypeError('not implemented');
  }

  // seek position
  async seek(pos: number): Promise<void> {
    throw new TypeError('not implemented');
  }

  shuffle() {
    throw new TypeError('not implemented');
  }
}

class DataSource implements Dataset<MySample, DataSourceMeta> {
  test: DataAccessorImpl;
  train: DataAccessorImpl;
  valid?: DataAccessorImpl;
  yourData: any;
  constructor(
    private url: string
  ) {}
  /**
   * construct data accessor here
   *   this.test = new Accessor(this.yourData.test);
   *   this.train = new Accessor(this.yourData.train);
   *   this.evaluate = new Accessor([]);
   */
  async init(): Promise<void> {
    throw new TypeError('not implemented');
  }

  async getDatasetMeta(): Promise<DataSourceMeta> {
    throw new TypeError('not implemented');
  }

  shuffle() {
    this.test.shuffle();
    this.train.shuffle();
    this.valid?.shuffle();
  }
}

/**
 * This is the entry of datasource script
 */
const datasourceEntry: DataSourceEntry<MySample, DataSourceMeta> =
async (option: ScriptOption): Promise<Dataset<MySample, DataSourceMeta>> => {
  const {
    url = ''
  } = option;
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

export default datasourceEntry;
