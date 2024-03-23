import express from 'express';
import { barChart, combineData, getList, getStatistics, initializedb, pieChart } from '../controllers/transactionController.js';


const router = express.Router();


router.route('/initializedb').get(initializedb);
router.route('/list').get(getList);
router.route('/statistics').get(getStatistics);
router.route('/barchart').get(barChart);
router.route('/piechart').get(pieChart);
router.route('/combined-data').get(combineData);



export default router;
