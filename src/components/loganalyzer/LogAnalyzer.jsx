import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  VStack,
  Text,
  Icon,
  Spinner,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { MdCloudUpload } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useDispatch } from 'react-redux';
import Result from './Result';

function LogAnalyzer() {
  const [file, setFile] = useState(null);
  const [logType, setLogType] = useState('auto-detect');
  const [detectedLogType, setDetectedLogType] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const toast = useToast();
  const dispatch = useDispatch();
  const [resultData, setResultData] = useState(null);

  const detectLogType = (data) => {
    const firstRow = data[1];
    console.log('First row data:', firstRow);

    if (!firstRow) {
      console.warn("Empty file or couldn't parse.");
      return '';
    }

    if ('NAT Source Port' in firstRow || 'Packets' in firstRow) {
      return 'firewall-logs';
    }
    if ('LineId' in firstRow || 'Level' in firstRow) {
      return 'system-logs';
    }
    if (
      'requestParameterinistancceType' in firstRow ||
      'awsRegion' in firstRow
    ) {
      return 'cloud-logs';
    }

    console.warn('No matching log type found.');
    return 'unknown';
  };

  const handleFileUpload = (uploadedFile) => {
    if (!uploadedFile) return;

    setLoading(true);
    if (
      uploadedFile.name.endsWith('.xlsx') ||
      uploadedFile.name.endsWith('.xls')
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const csvData = XLSX.utils.sheet_to_csv(worksheet);

        Papa.parse(csvData, {
          complete: (result) => {
            const detectedType = detectLogType(result.data);
            setDetectedLogType(detectedType);
            setLogType(detectedType);
            setLoading(false);
          },
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      Papa.parse(uploadedFile, {
        complete: (result) => {
          const detectedType = detectLogType(result.data);
          setDetectedLogType(detectedType);
          setLogType(detectedType);
          setLoading(false);
        },
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      handleFileUpload(uploadedFile);
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
        '.xls',
      ],
      'application/json': ['.json'],
      'text/csv': ['.csv'],
    },
    disabled: loading,
  });

  // Function to handle form submission. it should submit the form to an api using post request by getting the api link from env

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: 'No file selected.',
        description: 'Please upload an Excel or JSON file to continue.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('logType', logType);

      console.log('Form data being sent:', {
        file: file.name,
        logType,
      });

      // After successful upload, set resultData manually for now:
      setResultData({
        sheetName: file.name, // You can use file.name as Sheet Name
        logType: logType, // Log type selected by user
        resultStatus: 'Probable Attack', // Hardcoded or could come from API
        resultDate: new Date().toISOString(), // Current date-time
        attackProbability: 72.5, // Hardcoded or from API
        metrics: [
          { name: 'Failed Logins', value: 45 },
          { name: 'Suspicious IPs', value: 10 },
          { name: 'Average Response Time', value: '450ms' },
          { name: 'Total Requests', value: 12000 },
        ],
      });

      // === Assume file upload happens here ===
      // const apiUrl = process.env.REACT_APP_API_URL;
      // const response = await fetch(`${apiUrl}/upload`, {
      //   method: 'POST',
      //   body: formData,
      // });
      // const result = await response.json();

      // After successful upload, set resultData manually for now:
      setResultData({
        sheetName: file.name, // You can use file.name as Sheet Name
        logType: logType, // Log type selected by user
        resultStatus: 'Probable Attack', // Hardcoded or could come from API
        resultDate: new Date().toISOString(), // Current date-time
        attackProbability: 72.5, // Hardcoded or from API
        metrics: [
          { name: 'Failed Logins', value: 45 },
          { name: 'Suspicious IPs', value: 10 },
          { name: 'Average Response Time', value: '450ms' },
          { name: 'Total Requests', value: 12000 },
        ],
      });

      toast({
        title: 'File uploaded successfully!',
        description: 'Your file has been uploaded and processed.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error during file upload:', error);
      toast({
        title: 'File upload failed.',
        description: 'Please try again later.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setFile(null);
      setLogType('auto-detect');
      setDetectedLogType('');
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Box
        maxW="500px"
        mx="auto"
        mt="8"
        p="8"
        borderWidth="1px"
        borderRadius="2xl"
        boxShadow="lg"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing="6">
            <Text fontSize="2xl" fontWeight="bold" textAlign="center">
              Upload Logs
            </Text>

            <FormControl>
              <Flex
                {...getRootProps()}
                border="2px dashed"
                borderColor="gray.400"
                p="20px"
                textAlign="center"
                borderRadius="lg"
                cursor={loading ? 'not-allowed' : 'pointer'}
                direction="column"
                align="center"
                justify="center"
                height="150px"
                bg={loading ? 'gray.100' : 'transparent'}
              >
                <input {...getInputProps()} />
                {loading ? (
                  <Spinner color="blue.500" size="lg" />
                ) : (
                  <Text fontSize="lg">
                    Drag and drop a file, or click to select
                  </Text>
                )}
                {file && !loading && (
                  <Text mt="2" fontSize="sm" color="gray.600">
                    Selected: {file.name}
                  </Text>
                )}
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel>Log Type</FormLabel>
              <Select
                value={logType}
                variant="outline"
                onChange={(e) => setLogType(e.target.value)}
              >
                <option value="auto-detect">Auto-detect</option>
                <option value="firewall-logs">Firewall Logs</option>
                <option value="cloud-logs">Cloud Logs</option>
                <option value="system-logs">System Logs</option>
              </Select>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              leftIcon={<Icon as={MdCloudUpload} />}
              isLoading={loading}
            >
              Upload & Analyze
            </Button>
          </VStack>
        </form>
      </Box>

      {resultData && (
        <Box mx="20" my="5">
          <Result resultData={resultData} />
        </Box>
      )}
    </Box>
  );
}

export default LogAnalyzer;
