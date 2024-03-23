import axios from "axios";
import Transaction from "../models/transactionModel.js";

export const initializedb = async (req, res) => {
    try {

      if ((await Transaction.countDocuments()) > 0) return res.status(200).json({ message: 'Data is already fetched!' });

        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        // console.log(data);

        const insertedData = await Transaction.insertMany(data);

        if(!insertedData){
            return res.status(404).json({
                success:false,
                message:"DB not initialized",
            })
        } else console.log("DB initialized...")

        return res.status(200).json({
            success: true,
            data: insertedData,
        });

    } catch (error) {
        console.error('Error in initializing data :', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch data',
        });
    }
};

export const getList = async (req, res) => {
  try {
    const { month , search = '', page = 1, perPage = 10 } = req.query;

    if (!month) {
      return res.status(400).json({ success: false, error: 'Please provide a valid month.' });
    }

    const monthNumber = new Date(Date.parse(`1 ${month} 2000`)).getMonth() + 1;

    const MonthQuery = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, monthNumber]
      }
    };
    
    let searchQuery = {};

    if (search) {
      searchQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: { $eq: parseFloat(search) || 0 } } 
        ]
      };
    }

    const query = { ...MonthQuery, ...searchQuery };

    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query).skip((page - 1) * perPage).limit(perPage);

    return res.status(200).json({
      success: true,
      total ,
      page : parseInt(page),
      perPage : parseInt(perPage),
      data: transactions
    });
  } catch (error) {
    console.error('Error listing transactions:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to list transactions'
    });
  }
}

export const getStatistics = async (req, res) => {
    try {
        const { month } = req.query;

        if (!month) {
          return res.status(400).json({ success: false, error: 'Please provide a valid month.' });
        }

        const monthNumber = new Date(Date.parse(`1 ${month} 2000`)).getMonth() + 1;

        const MonthQuery = {
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, monthNumber]
            }
        };

        const totalSaleAmount = await Transaction.aggregate([
            { $match: MonthQuery },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        const totalSoldItems = await Transaction.countDocuments({ ...MonthQuery, sold: true });

        const totalUnsoldItems = await Transaction.countDocuments({ ...MonthQuery, sold: false });

        return res.status(200).json({
            success: true,
            totalSaleAmount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
            totalSoldItems,
            totalUnsoldItems
        });
    } catch (error) {
        console.error('Error getting statistics:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get statistics'
        });
    }
}

export const barChart = async (req, res) => {
    try {
      const { month } = req.query;

      if (!month) {
        return res.status(400).json({ success: false, error: 'Please provide a valid month.' });
      }
  
      const monthNumber = new Date(Date.parse(`1 ${month} 2000`)).getMonth() + 1;
      const MonthQuery = {
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, monthNumber]
        }
      };
  
      const result = await Transaction.aggregate([
        { $match: MonthQuery },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lte: ['$price', 100] }, then: '0 - 100' },
                  { case: { $lte: ['$price', 200] }, then: '101 - 200' },
                  { case: { $lte: ['$price', 300] }, then: '201 - 300' },
                  { case: { $lte: ['$price', 400] }, then: '301 - 400' },
                  { case: { $lte: ['$price', 500] }, then: '401 - 500' },
                  { case: { $lte: ['$price', 600] }, then: '501 - 600' },
                  { case: { $lte: ['$price', 700] }, then: '601 - 700' },
                  { case: { $lte: ['$price', 800] }, then: '701 - 800' },
                  { case: { $lte: ['$price', 900] }, then: '801 - 900' },
                  { case: { $gt: ['$price', 900] }, then: '901-above' }
                ],
                default: 'Unknown'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]);
      
      const formattedData = [
        { priceRange: '0 - 100', count: 0 },
        { priceRange: '101 - 200', count: 0 },
        { priceRange: '201 - 300', count: 0 },
        { priceRange: '301 - 400', count: 0 },
        { priceRange: '401 - 500', count: 0 },
        { priceRange: '501 - 600', count: 0 },
        { priceRange: '601 - 700', count: 0 },
        { priceRange: '701 - 800', count: 0 },
        { priceRange: '801 - 900', count: 0 },
        { priceRange: '901-above', count: 0 }
      ];
  
      result.forEach(({ _id, count }) => {
        const index = formattedData.findIndex((item) => item.priceRange === _id);
        if (index !== -1) {
          formattedData[index].count = count;
        }
      });
  
      return res.status(200).json({
        success: true,
        data: formattedData
      });
    } catch (error) {
      console.error('Error creating bar chart:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to create bar chart'
      });
    }
}

export const pieChart = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ success: false, error: 'Please provide a valid month.' });
    }

    const monthNumber = new Date(Date.parse(`1 ${month} 2000`)).getMonth() + 1;
    const MonthQuery = {
      $expr: {
        $eq: [{ $month: '$dateOfSale' }, monthNumber]
      }
    };

    const result = await Transaction.aggregate([
      { $match: MonthQuery },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error creating pie chart:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create pie chart'
    });
  }
}

export const combineData = async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ success: false, error: 'Please provide a valid month.' });
    }

    try {
        const statisticsResponse = await axios.get(`https://roxiler-systems-challenge.onrender.com/api/v1/transactions/statistics?month=${month}`);
        const statisticsData = statisticsResponse.data;

        const barChartResponse = await axios.get(`https://roxiler-systems-challenge.onrender.com/api/v1/transactions/barchart?month=${month}`);
        const barChartData = barChartResponse.data;

        const pieChartResponse = await axios.get(`https://roxiler-systems-challenge.onrender.com/api/v1/transactions/piechart?month=${month}`);
        const pieChartData = pieChartResponse.data;

        return res.status(200).json({
            success: true,
            data: {
              statistics: statisticsData,
              barChart: barChartData,
              pieChart: pieChartData
            }
        });
    } catch (error) {
        console.error('Error combining data:', error);
        return res.status(500).json({ success: false, error: 'Failed to combine data.' });
    }
};
