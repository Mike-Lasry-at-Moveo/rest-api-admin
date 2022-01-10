import mongoose from "mongoose";
import { Errors, Options } from "../config/constants";

interface IRestaurant {
    _id?: string,
    name: string,
    description: string,
    imgUrl: string,
    open: number,
    address: string
};

interface IRestaurantDocument extends mongoose.Document {
    name: string,
    description: string,
    imgUrl: string,
    open: number,
    address: string
};

interface IRestaurantModel extends mongoose.Model<IRestaurantDocument> {
    build(attr: IRestaurant): IRestaurant;
    findAll(): Promise<IRestaurantDocument[]>;
    search(contains: string): Promise<IRestaurantDocument[]>;
    add(restaurant: IRestaurant): Promise<IRestaurantDocument>;
    change(restaurantId: string, key: string, value: string): Promise<any>;
    delete(restaurantId: string): Promise<any>;
    getById(restaurantId: string): Promise<any>;
};

const restaurantSchema = new mongoose.Schema({
    name: { type: String },
    description: {type: String},
    imgUrl: {type: String},
    open: { type: Number, default: 128 },
    address: { type: String }
});

restaurantSchema.statics.build = (attr: IRestaurant): IRestaurant => {
    return new Restaurant(attr);
};

restaurantSchema.statics.search = async (contains: any): Promise<IRestaurantDocument[]> => {
    let response = [] as IRestaurantDocument[];
    try {
        response = await Restaurant.find({
            // name: {"$regex": contains, "$options":"i"}
            $or: [ 
                { ...getFilterByKey(Options.NAME,contains) },
                { ...getFilterByKey(Options.ADDR,contains) },
                { ...getFilterByKey(Options.DESC,contains) },
             ]
        })
    } catch (error) {
        console.error.bind(Errors.BIND_ERR);
    } finally {
        return response;
    }
};

restaurantSchema.statics.findAll = async (): Promise<IRestaurantDocument[]> => {
    let response = [] as IRestaurantDocument[];
    try {
        response = await Restaurant.find({});
    } catch (error) {
        console.error.bind(Errors.BIND_ERR);
    } finally {
        return response;
    }
};

restaurantSchema.statics.getById = async (id: string): Promise<any> => {
    let response = {} as any;
    try {
        response = await Restaurant.findById(id)
    } catch (error) {
        console.error.bind(Errors.BIND_ERR);
    } finally { return response; }
};

restaurantSchema.statics.add = async (restaurant: IRestaurantDocument): Promise<IRestaurantDocument> => {
    let response = {} as IRestaurantDocument;
    try {
        response = await Restaurant.create(restaurant);
    } catch (error) {
        console.error.bind(`${Errors.REST_CREATE}:\n${restaurant}`);
    } finally{
        return response;
    }
};

restaurantSchema.statics.change = async (restaurantId: string, key: string, value: string): Promise<any> => {
    let response = null;
    try {
        response = await Restaurant.updateOne({ _id: restaurantId }, { $set: { ...getUpdate(key, value) } });
    } catch (error) {
        console.error.bind(`${Errors.REST_UPDT}: ${restaurantId}`);
    } finally { return response };
};

restaurantSchema.statics.delete = async (restaurantId: string): Promise<any> => {
    let response = null;
    try {
        response = await Restaurant.deleteOne({ _id: restaurantId });
    } catch (error) {
        console.error.bind(`${Errors.REST_DEL}: ${restaurantId}:\n`);
    } return response;
};

const Restaurant = mongoose.model<IRestaurantDocument, IRestaurantModel>(`Restaurant`, restaurantSchema);
export { IRestaurant, Restaurant, IRestaurantDocument };


// Util functions

function getUpdate(key: string, value: string) {
    switch (key) {
        case Options.NAME: return { name: value };
        case Options.DISHES: return { dishes: value };
        case Options.OPEN: return { open: value };
        case Options.ADDR: return { address: value };
        default: return null;
    }
}

function getFilter(contains: string){
    return {'$regex': contains, '$options': 'i'};
}

function getFilterByKey(key: string, value: string){
    switch(key){
        case Options.NAME: return {name: getFilter(value)};
        case Options.ADDR: return {address: getFilter(value)};
        case Options.DESC: return {description: getFilter(value)};
    }
}