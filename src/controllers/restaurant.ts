import { Response, Request } from "express";
import { restaurantsService } from "../services/restaurant";

const getAllRestaurants = async (req: Request, res: Response) => {
    const restaurants = await restaurantsService.getRestaurants();
    res.status(201).send({success:true, data:restaurants});
};

const getRestaurantById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const restaurant = await restaurantsService.getRestaurantById(id);
    res.status(201).send({success:true, data: restaurant});
};

const searchRestaurants = async (req: Request, res: Response) => {
    const { contains } = req.body;
    const restaurants = await restaurantsService.searchRestaurants(contains);
    res.status(201).send({success:true, data: restaurants});
};

const createRestaurant = async (req: Request, res: Response) => {
    const {name,description,open,address,imgUrl } = req.body;
    const restaurant = await restaurantsService.createRestaurant( {name,description,open,address,imgUrl } );
    res.status(201).send(restaurant);
};

const updateRestaurant = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {key, value} = req.body;
    const restaurant = await restaurantsService.updateRestaurant(id, key, value)
    res.status(201).send(restaurant);
};

const deleteRestaurant = async (req: Request, res: Response) => {
    const success = await restaurantsService.deleteRestaurant(req.params.id)
    res.status(201).send(success);
};

const restaurantsController = {
    getAllRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    searchRestaurants,
};

export { restaurantsController };