import { Response, Request } from "express";
import { restaurantsService } from "../services/restaurant";

const getAllRestaurants = async (req: Request, res: Response) => {
    restaurantsService.getRestaurants()
        .then(restaurants => res.status(201).send({success:true, data:restaurants}));
};

const createRestaurant = async (req: Request, res: Response) => {
    const {name,dishes,open,address } = req.body;
    restaurantsService.createRestaurant( {name,dishes,open,address } )
        .then( restaurant => res.status(201).send(restaurant));
};

const updateRestaurant = async (req: Request, res: Response) => {
    const id = req.params.id;
    const {key, value} = req.body;

    restaurantsService.updateRestaurant(id, key, value)
        .then( restaurant => res.status(201).send(restaurant));
};

const deleteRestaurant = async (req: Request, res: Response) => {
    restaurantsService.deleteRestaurant(req.params.id)
        .then(success => res.status(201).send(success));
};

const restaurantsController = {
    getAllRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
};

export { restaurantsController };