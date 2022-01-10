const RESTAURANT_PATH = "/api/restaurants";
import { restaurantsController } from "../controllers/restaurant";
import { Router } from "express";
const router = Router();

router
    .get(RESTAURANT_PATH, restaurantsController.getAllRestaurants)
    .get(`${RESTAURANT_PATH}/:id`, restaurantsController.getRestaurantById)

    .post(RESTAURANT_PATH, restaurantsController.createRestaurant)
    .post(`${RESTAURANT_PATH}/search`, restaurantsController.searchRestaurants)
    
    .patch(`${RESTAURANT_PATH}/:id`, restaurantsController.updateRestaurant)
    
    .delete(`${RESTAURANT_PATH}/:id`, restaurantsController.deleteRestaurant);

export { router as restaurantsRouter };

