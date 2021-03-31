import { DataSourceApi, DataSourceEntry, DataSourceType, Sample, TableColumnType, DataSourceMeta } from '@pipcook/pipcook-core';
/**
 * sample data type, it's the type of Sample.data
 */
type SampleDataType = Array<number>;
/**
 * The options for current script
 */
interface ScriptOption {
  // All the option could be undefined if user not passed in, so we should define it to be optional.
  url?: string;
}

/**
 * This is the entry of datasource script
 */
const datasourceEntry: DataSourceEntry<SampleDataType> = async (option: ScriptOption): Promise<DataSourceApi<SampleDataType>> => {
  const {
    url = ''
  } = option;
  if (!url) {
    throw new TypeError('url should be defined');
  }
  // prepare data here

  /**
   * return instance of DataSourceApi, this is a sample for Table
   */
  return {
    getDataSourceMeta: async (): Promise<DataSourceMeta> => {
      return {
        type: DataSourceType.Table,
        size: {
          // train table length
          train: 0,
          // test table length
          test: 0
        },
        // table schema
        tableSchema: [
          { name: 'input', type: TableColumnType.String },
          { name: 'output', type: TableColumnType.String }
        ],
        dataKeys: [ 'input' ],
        labelMap: new Map()
        // labelMap: new Map({
        //   1: 'label1',
        //   2: 'label2'
        // })
      }
    },
    // test data accessor
    test: {
      next: async (): Promise<Sample<SampleDataType>> => {
        // read single sample
        return {
          label: 1,
          data: [ 1, 2, 3 ]
        };
      },
      nextBatch: async (batchSize: number): Promise<Array<Sample<SampleDataType>> | null> => {
        // read data from source, return array of sample or null if no more data
        return [];
      },
      seek: async (pos: number): Promise<void> => {
        // seek position
      }
    },
    // train data accessor
    train: {
      next: async (): Promise<Sample<SampleDataType>> => {
        // read single sample
        return {
          label: 1,
          data: [ 1, 2, 3 ]
        };
      },
      nextBatch: async (batchSize: number): Promise<Array<Sample<SampleDataType>> | null> => {
        // read data from source, return array of sample or null if no more data
        return [];
      },
      seek: async (pos: number): Promise<void> => {
        // seek position
      }
    }
  };
};

export default datasourceEntry;
