import mongoose from "mongoose";

interface IRestaurant {
    _id?: String,
    name: String,
    dishes: [String],
    open: Number,
    address: String 
};

interface IRestaurantDocument extends mongoose.Document {
    name: String,
    dishes: [String],
    open: Number,
    address: String 
};

interface IRestaurantModel extends mongoose.Model<IRestaurantDocument> {
    build(attr: IRestaurant): IRestaurant;
    findAll(): Promise<IRestaurantDocument[]>;
    add(restaurant: IRestaurant): Promise<IRestaurantDocument>;
    change(restaurantId: String, key: String, value: String): Promise<any>;
    delete(restaurantId: String): Promise<any>;
};

const restaurantSchema = new mongoose.Schema({
    name: { type: String },
    dishes: {type: [String]},
    open: {type: Number},
    address: { type: String }
});

restaurantSchema.statics.build = (attr: IRestaurant): IRestaurant => {
    return new Restaurant(attr);
};

restaurantSchema.statics.findAll = async (): Promise<IRestaurantDocument[]>=> {
    let response: IRestaurantDocument[] = [];
    try {
        response = await Restaurant.find();
    } catch (error) {
        console.error.bind("error");
    } return response;
};

restaurantSchema.statics.add = async (restaurant: IRestaurantDocument): Promise<IRestaurantDocument> => {
    let response: IRestaurantDocument | null;
     try{
         response = await Restaurant.create(restaurant);
     } catch (error) {
         console.error.bind(`Error occured trying to add a new restaurant:\n${restaurant}`); 
         response = {} as IRestaurantDocument;        
     } return response;
};

restaurantSchema.statics.change = async (restaurantId: string, key: String, value: String): Promise<any> => {
    let response = null;
    try {
        response = await Restaurant.updateOne( {_id: restaurantId}, {$set: {...getUpdate(key, value)}} );
    } catch (error) {
        console.error.bind(`Error occured trying to change a restaurant: ${restaurantId}`);
    } finally { return response };
};

restaurantSchema.statics.delete = async (restaurantId: String): Promise<any> => {
    let response = null;
    try{
        response = await Restaurant.deleteOne({_id: restaurantId});
    } catch (error) {
        console.error.bind(`Error occured trying to delete restaurant: ${restaurantId}:\n`);
    } return response;
}; 

const Restaurant = mongoose.model<IRestaurantDocument, IRestaurantModel>(`Restaurant`, restaurantSchema);
export { IRestaurant, Restaurant, IRestaurantDocument };

function getUpdate(key:String, value: String){
    switch (key){
        case "name":    return {name: value};
        case "dishes":  return {dishes: value};
        case "open":    return {open: value};
        case "address": return {address: value};
        default:        return null;
    }
}