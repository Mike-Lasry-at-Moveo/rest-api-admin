import { Restaurant, IRestaurantDocument, IRestaurant } from "../models/restaurant"

const getRestaurants = async (): Promise<IRestaurantDocument[]> => {
    return await Restaurant.findAll();
}

const createRestaurant = async (restaurant: IRestaurant): Promise<IRestaurantDocument> => {
    return await Restaurant.add(Restaurant.build(restaurant));   
};

const updateRestaurant = async (restaurantId: String, key: String, value: String): Promise<IRestaurantDocument> => {
    return await Restaurant.change(restaurantId, key, value);
};

const deleteRestaurant = async (_id: String): Promise<IRestaurantDocument> => {
    return await Restaurant.delete(_id);
};

const restaurantsService = { 
    getRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
};

export { restaurantsService };

