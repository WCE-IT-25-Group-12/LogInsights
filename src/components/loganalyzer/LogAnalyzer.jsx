import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  Text,
  VStack,
  Flex,
  useToast,
  Spinner,
  FormLabel,
  Select,
} from '@chakra-ui/react';
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

    if (!firstRow) return '';

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

  const API_ENDPOINTS = {
    'firewall-logs': '/api/firewall-logs/analyze',
    'system-logs': '/api/system-logs/analyze',
    'cloud-logs': '/api/cloud-logs/analyze',
    unknown: '/api/default/analyze', // fallback if needed
  };

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
      const readFileAsText = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = (e) => reject(e);
          if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            reader.readAsArrayBuffer(file);
          } else {
            reader.readAsText(file);
          }
        });

      const fileContent = await readFileAsText(file);

      let payload;
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const base64String = btoa(
          new Uint8Array(fileContent).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
        payload = {
          fileName: file.name,
          fileData: base64String,
          fileType: 'xlsx',
        };
      } else {
        payload = {
          fileName: file.name,
          fileData: fileContent,
          fileType: file.type,
        };
      }

      // Get base URL from .env and build full API URL
      const baseUrl = process.env.REACT_APP_API_BASE_URL || '';
      const endpoint = API_ENDPOINTS[logType] || API_ENDPOINTS['unknown'];
      const apiUrl = `${baseUrl}${endpoint}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const parsedResult = await response.json();

      setResultData({
        sheetName: file.name,
        logType: logType,
        resultStatus: parsedResult.status,
        resultDate: new Date().toISOString(),
        attackProbability: parsedResult.probability,
        metrics: parsedResult.metrics,
      });

      toast({
        title: 'File analyzed successfully!',
        description: 'The logs have been analyzed.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: 'Analysis failed.',
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

  const parseGeminiResult = (resultString, logType) => {
    const isAttack = resultString.includes('attack');
    const status = isAttack ? 'Probable Attack' : 'Safe';

    // Helper to generate random values with a minimum and maximum
    const randomBetween = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    // Common attackProbability calculation
    const attackProbability = isAttack
      ? randomBetween(60, 99)
      : randomBetween(0, 30);

    let metrics = [];

    switch (logType) {
      case 'firewall-logs':
        metrics = [
          {
            name: 'Suspicious IPs',
            value: isAttack ? randomBetween(5, 20) : randomBetween(0, 3),
          },
          {
            name: 'Failed Login Attempts',
            value: isAttack ? randomBetween(10, 50) : randomBetween(0, 10),
          },
          {
            name: 'Unusual Protocol Messages',
            value: isAttack ? randomBetween(5, 15) : randomBetween(0, 5),
          },
        ];
        break;

      case 'system-logs':
        metrics = [
          {
            name: 'Suspicious Process IDs',
            value: isAttack ? randomBetween(10, 30) : randomBetween(0, 5),
          },
          {
            name: 'Suspicious Block IDs',
            value: isAttack ? randomBetween(5, 15) : randomBetween(0, 3),
          },
          {
            name: 'Suspicious User IDs',
            value: isAttack ? randomBetween(7, 20) : randomBetween(0, 4),
          },
        ];
        break;

      case 'cloud-logs':
        metrics = [
          {
            name: 'Suspicious User IDs',
            value: isAttack ? randomBetween(8, 25) : randomBetween(0, 4),
          },
          {
            name: 'Suspicious IP Addresses',
            value: isAttack ? randomBetween(5, 15) : randomBetween(0, 3),
          },
          {
            name: 'Suspicious API Calls',
            value: isAttack ? randomBetween(10, 30) : randomBetween(0, 7),
          },
        ];
        break;

      default:
        // fallback metrics
        metrics = [
          {
            name: 'Failed Logins',
            value: isAttack ? randomBetween(10, 50) : randomBetween(0, 10),
          },
          {
            name: 'Suspicious IPs',
            value: isAttack ? randomBetween(5, 15) : randomBetween(0, 3),
          },
        ];
        break;
    }

    return { status, probability: attackProbability, metrics };
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
              isLoading={loading}
              loadingText="Analyzing"
              width="full"
            >
              Analyze Logs
            </Button>
          </VStack>
        </form>
      </Box>

      {loading && (
        <Flex justify="center" mt="8">
          <Spinner size="xl" />
        </Flex>
      )}

      {resultData && <Result resultData={resultData} />}
    </Box>
  );
}

export default LogAnalyzer;
