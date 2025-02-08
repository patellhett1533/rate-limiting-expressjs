import { Document, Schema, Model } from "mongoose";

interface QueryResult<T extends Document> {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

interface SortOptions {
  sortBy?: string;
}

interface PopulateOptions {
  populate?: string;
}

interface SearchOptions {
  search?: string;
}

interface PaginationOptions
  extends SortOptions,
    PopulateOptions,
    SearchOptions {
  limit?: number;
  page?: number;
}

const paginate = <T extends Document>(schema: Schema<T>): void => {
  schema.statics.paginate = async function (
    filter: object,
    options: PaginationOptions = {}
  ): Promise<QueryResult<T>> {
    let sort: string = "";
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(",").forEach((sortOption: string) => {
        const [key, order] = sortOption.split(":");
        sortingCriteria.push((order === "desc" ? "-" : "") + key);
      });
      sort = sortingCriteria.join(" ");
    } else {
      sort = "createdAt";
    }

    const limit =
      options.limit && parseInt(options.limit.toString(), 10) > 0
        ? parseInt(options.limit.toString(), 10)
        : 10;
    const page =
      options.page && parseInt(options.page.toString(), 10) > 0
        ? parseInt(options.page.toString(), 10)
        : 1;
    const skip = (page - 1) * limit;

    if (options.search) {
      const searchRegex = new RegExp(options.search, "i");
      filter = {
        ...filter,
        name: { $regex: searchRegex },
      };
    }

    const countPromise = this.countDocuments(filter).exec();

    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(",").forEach((populateOption: string) => {
        const populatePath = populateOption
          .split(".")
          .reverse()
          .reduce((a: string, b: string) => {
            return `${a}.populate.(${b})`;
          });
        docsPromise = docsPromise.populate(populatePath);
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result: QueryResult<T> = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

export default paginate;
