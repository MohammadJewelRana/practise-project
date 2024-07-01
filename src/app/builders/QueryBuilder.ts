import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>; //model
  public query: Record<string, unknown>; //query from req.query

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery; //protita model er jonno query
    this.query = query; //req.query theke ashbe
  }

  //search method
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      //this.modelQuery...ek ek omoy ek ek model ashbe
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  //filtering
  filter() {
    const queryObj = { ...this.query }; //copy the query
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']; //dont want
    excludeFields.forEach((el) => delete queryObj[el]); // DELETING THE FIELDS SO THAT IT CAN'T MATCH OR FILTER EXACTLY

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  //sorting
  sort() {
    // const sort = this?.query?.sort || '-createdAt';//single parameter sort

    //api comes >sort=name,email
    //but query accept  sort=name email
    //thats why split join kore orokom banate hobe

    const sort =
      (this?.query?.sort as string)?.split(',').join(' ') || '-createdAt'; //multiple parameter sort
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  //pagination
  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  //fields filtering
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',').join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
