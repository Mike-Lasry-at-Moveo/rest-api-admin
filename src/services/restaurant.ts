import { Restaurant, IRestaurantDocument, IRestaurant } from "../models/restaurant"

const getRestaurants = async (): Promise<IRestaurantDocument[]> => {
    return await Restaurant.findAll();
}

const getRestaurantById = async (id: string): Promise<IRestaurantDocument> => {
    return await Restaurant.getById(id);
}

const searchRestaurants = async (contains: string): Promise<IRestaurantDocument[]> => {
    return await Restaurant.search(contains);
}

const createRestaurant = async (restaurant: IRestaurant): Promise<IRestaurantDocument> => {
    return await Restaurant.add(Restaurant.build(restaurant));   
};

const updateRestaurant = async (restaurantId: string, key: string, value: string): Promise<IRestaurantDocument> => {
    return await Restaurant.change(restaurantId, key, value);
};

const deleteRestaurant = async (_id: string): Promise<IRestaurantDocument> => {
    return await Restaurant.delete(_id);
};

const restaurantsService = { 
    getRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantById,
    searchRestaurants,
};

export { restaurantsService };

