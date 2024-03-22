import express from 'express';
import { barChart, getCombinedStatistics, getList, getStatistics, initializedb, pieChart } from '../controllers/transactionController.js';


const router = express.Router();


router.route('/initializedb').get(initializedb);
router.route('/list').get(getList);
router.route('/statistics').get(getStatistics);
router.route('/barchart').get(barChart);
router.route('/piechart').get(pieChart);
router.route('/combined-stat').get(getCombinedStatistics);



export default router;
