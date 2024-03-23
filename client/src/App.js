import { Box, Center, Flex, HStack, Input, Select, Text, Table, Thead, Tbody, Tr, Th, Td, Link, Heading, Spinner } from '@chakra-ui/react';
import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SEARCH_LIST_TRANSACTIONS, STATISTICS } from './utils/routes';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';

function App() {
  const [search, setSearch] = useState('');
  
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [list,setList] = useState([]);
  const [statistics,setStatistics] = useState(null);
  const [pageNo,setPageNo] = useState(1);
  const [perPage,setPerPage] = useState(10);
  const [totalItems,setTotalItems] = useState(0);
  const [loading,setLoading] = useState(false);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);

  const fetchListData = async (value,month,page=1,perPage=10) => {
    // console.log(value,month); 
    try {
      const {data} = await axios.get(`${SEARCH_LIST_TRANSACTIONS}?search=${value}&month=${month}&page=${page}&perPage=${perPage}`)
      setList(data.data)
      setTotalItems(data.total);
      // console.log(data)

    } catch (error) {
      console.log("error " , error)
    }
  }

  const fetchStatistics = async(month) => {
    const {data} = await axios.get(`${STATISTICS}?month=${month}`);
    // console.log(data)
    setStatistics(data);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchListData('', months[new Date().getMonth()]),
        fetchStatistics(months[new Date().getMonth()])
      ]);
      setLoading(false);
    };
  
    fetchData();
  }, []);
  

  const handleSearchChange = (value) => {
    setSearch(value);
    clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(async () => {
      setLoading(true);
      await fetchListData(value, selectedMonth);
      setLoading(false);
    }, 1000));
  };
  
  const handleMonthChange = async(value) => {
    setLoading(true);
    setSelectedMonth(value);
    await fetchListData(search, value);
    await fetchStatistics(value);
    setLoading(false);
  };
  

  return (
    <>
      <Center m={5}>
        <Flex w={{base:'100%',sm:'80%'}} direction={'column'} alignItems={'center'}>
          <Heading my={5}>Transaction Dashboard</Heading>
          
          <Box display={{ base: 'block', md: 'flex' }} flexDirection={{ base: 'column', md: 'row' }} justifyContent={{ base: 'flex-start', md: 'space-between' }}w={'100%'} py={5}>
            <Input placeholder='Search...' pr={{ base: 5, md: 0 }} w={{ base: '100%', md: '40%' }} onChange={(e) => handleSearchChange(e.target.value, selectedMonth)} mb={{ base: 5, md: 0 }} />
            <Select value={selectedMonth} onChange={(e) => handleMonthChange(e.target.value)} w={{ base: '100%', md: '40%' }}>
                {months.length > 0 && months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                ))}
            </Select>
          </Box>

          {
            loading ? (
              <Center>
                <Spinner size="xl" />
              </Center>
            ) : (
              <Box maxH={'70vh'} w={'80vw'} overflowY={'auto'}>
                <Table variant="simple" w={'full'} size={{base:'sm', md:'md'}} >
                  <Thead>
                    <Tr>
                      <Th position="sticky" top="0" zIndex="1" bg={'white'}>ID</Th>
                      <Th position="sticky" top="0" zIndex="1" bg={'white'}>Title</Th>
                      <Th position="sticky" top="0" zIndex="1" bg={'white'}>Description</Th>
                      <Th position="sticky" top="0" zIndex="1" bg={'white'}>Price</Th>
                      <Th position="sticky" top="0" zIndex="1" bg={'white'}>Category</Th>
                      <Th position="sticky" top="0" zIndex="1" bg={'white'}>Sold</Th>
                      <Th position="sticky" top="0" zIndex="1" bg={'white'}>Image</Th>
                      <Th position="sticky" top="0" zIndex="1" bg={'white'}>Date of Sale</Th>
                    </Tr>
                  </Thead>
                  <Tbody w={'100%'}>
                    {list.length > 0 ? (
                      list.map((product) => <TableRow key={product.id} product={product} />)
                    ) : (
                      <Text width={'100%'} textAlign={'center'} textColor={'red'} p={5} >No Data found.</Text>
                    )}
                  </Tbody>
                </Table>
              </Box>
            )
          }
          
            <Flex width={'100%'} direction={'colum'} justify={'space-between'} py={4} b>
              <Text>Page No. : {pageNo}</Text>
              <HStack>
                <Link
                  onClick={
                    () => {
                      if (pageNo < (totalItems / perPage) ){
                        setPageNo(pageNo+1);
                        fetchListData(search,selectedMonth,pageNo+1,perPage)
                      }
                    }
                  }
                  cursor={pageNo < (totalItems / perPage) ? "pointer" : "not-allowed"}
                  color={pageNo < (totalItems / perPage) ? "blue.500" : "gray.400"}
                  _hover={{ textDecoration: "underline" }}
                  _focus={{ outline: "none" }}
                >Next</Link>
                <Text>-</Text>
                <Link
                  onClick={
                    () => {
                      if (pageNo > 1) {
                        setPageNo(pageNo-1);
                        fetchListData(search,selectedMonth,pageNo-1,perPage)
                      }
                    }
                  }
                  cursor={pageNo > 1 ? "pointer" : "not-allowed"}
                  color={pageNo > 1 ? "blue.500" : "gray.400"}
                  _hover={{ textDecoration: "underline" }}
                  _focus={{ outline: "none" }}
                >Previous</Link>
              </HStack>
              <HStack>
                <Text>Per Page : </Text>
                <Select
                  value={perPage}
                  width={'auto'}
                  onChange={(e) => {
                    setPerPage(e.target.value);
                    setPageNo(1);
                    fetchListData(search,selectedMonth,pageNo,e.target.value)
                  }}
                >
                  {Array.from({length: 10}, (_, index) => {
                    const value = index + 1; 
                    return <option key={value} value={value}>{value}</option>;
                  })}
                </Select>
              </HStack>
            </Flex>

          {
            statistics &&
            (
              <>
                <Heading size="md" mt={10} mb={5} textAlign="center">Statistics - {selectedMonth}</Heading>
                <Box
                  _hover={{ transform: 'scale(1.07)' }}
                  transition="transform 0.3s ease-in-out"
                >
                  <Box p={5} borderRadius="md" boxShadow="md">
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text fontWeight="bold">Total Sale Amount:</Text>
                      <Text color="green.500">₹{statistics.totalSaleAmount.toFixed(2)}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text fontWeight="bold">Total Sold Items:</Text>
                      <Text>{statistics.totalSoldItems}</Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="bold">Total Unsold Items:</Text>
                      <Text>{statistics.totalUnsoldItems}</Text>
                    </Flex>
                  </Box>
                </Box>
              </>
              
            )
          }

          <Box width={{base:'100%',md:'80%'}}>
            <BarChart month={selectedMonth} />
          </Box>

          <Box width={{base:'100%',md:'80%'}}>
            <PieChart month={selectedMonth}/>
          </Box>

        </Flex>
      </Center>
    </>
  );
}

const TableRow = ({ product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <Tr
      key={product.id} 
      _hover={{ backgroundColor : 'gray.100' }}
    >
      <Td>{product.id}</Td>
      <Td>{product.title}</Td>
      <Td>
        {showFullDescription ? (
          <>
            {product.description}
            <Link onClick={toggleDescription} textColor={'blue.300'}>see less</Link>
          </>
        ) : (
          <>
            {product.description.length > 100 ? `${product.description.slice(0, 100)}` : product.description}
            {product.description.length > 100 && <Link onClick={toggleDescription} textColor={'blue.300'}>...see more</Link>}
          </>
        )}
      </Td>
      <Td>₹{product.price}</Td>
      <Td>{product.category}</Td>
      <Td>{product.sold ? 'Sold' : 'Unsold'}</Td>
      <Td>
        <img src={product.image} alt={product.title} style={{ maxWidth: '60px' }} />
      </Td>
      <Td>{new Date(product.dateOfSale).toDateString()}</Td>
    </Tr>
  );
};

export default App;
