const router = require('express').Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middleware/adminAuth');

router.post('/login', adminController.Login);
router.post('/create-user',adminAuth, adminController.CreateUser);
router.get('/users', adminAuth,adminController.GetUsers);
router.get('/user/:userId',adminAuth, adminController.GetUser);
router.post('/add-item-to-user',adminAuth, adminController.AddItemToUser);

router.post('/create-item',adminAuth,adminController.CreateItem);
router.get('/items',adminAuth, adminController.GetItems);
router.get('/item/:itemId',adminAuth, adminController.GetItem);
router.get('/user-items', adminAuth,adminController.GetItemsFromUser);
router.get('/users-orders',adminAuth, adminController.GetUserOrders);
router.get('/protected',adminAuth, adminController.ProtectedRoute);

router.delete('/delete-user/:userId',adminAuth, adminController.DeleteUser);
router.delete('/delete-item/:itemId',adminAuth, adminController.DeleteItem);
router.put('/update-user',adminAuth, adminController.UpdateUser);
router.put('/update-item', adminAuth,adminController.UpdateItem);
router.delete('/delete-item-from-user',adminAuth, adminController.DeleteItemFromUser);
router.delete('/delete-order/:userId/:itemId',adminAuth, adminController.DeleteOrderFromUser);

router.post('/create-redeem', adminAuth,adminController.CreateRedeem);
router.get('/redeems', adminAuth,adminController.GetRedeem);
router.put('/update-redeem',adminAuth, adminController.UpdateRedeem);
router.delete('/delete-redeem',adminAuth, adminController.DeleteRedeem);

router.get('/home-statitics',adminAuth, adminController.HomeStatitics);



module.exports = router;