import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Select,
  Text,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { useDispatch } from 'react-redux';
import {
  setMsg,
  setPara1,
  setPara2,
  setPara3,
} from '../../../../redux/authSlice';

export default function Upload(props) {
  const [logType, setLogType] = useState('');
  const [detectedLogType, setDetectedLogType] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();

  // Function to detect log type
  const detectLogType = (data) => {
    const firstRow = data[1]; // First row of CSV (object format)
    console.log('First row data:', firstRow);

    if (!firstRow) {
      console.warn("Empty file or couldn't parse.");
      return '';
    }

    if ('NAT Source Port' in firstRow || 'Packets' in firstRow) {
      return 'firewall';
    }
    if ('LineId' in firstRow || 'Level' in firstRow) {
      return 'system';
    }
    if (
      'requestParameterinistancceType' in firstRow ||
      'awsRegion' in firstRow
    ) {
      return 'cloud';
    }

    console.warn('No matching log type found.');
    return 'unknown';
  };

  // Function to handle file parsing
  const handleFileUpload = (uploadedFile) => {
    if (uploadedFile.name.endsWith('.xlsx')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Get first sheet
        const worksheet = workbook.Sheets[sheetName];

        // Convert worksheet to CSV
        const csvData = XLSX.utils.sheet_to_csv(worksheet);

        // Parse the converted CSV
        Papa.parse(csvData, {
          complete: (result) => {
            const detectedType = detectLogType(result.data);
            setDetectedLogType(detectedType);
            setLogType(detectedType);
          },
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
      };
      reader.readAsArrayBuffer(uploadedFile);
    } else {
      // If it's already a CSV file, parse it directly
      Papa.parse(uploadedFile, {
        complete: (result) => {
          const detectedType = detectLogType(result.data);
          setDetectedLogType(detectedType);
          setLogType(detectedType);
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
    accept: '.csv, .xlsx',
    disabled: loading,
  });

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'No file uploaded',
        description: 'Please upload a CSV or XLSX file.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!logType) {
      toast({
        title: 'No log type selected',
        description: 'Please select a log type before submitting.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const jsonData = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          complete: (result) => resolve(result.data),
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          error: reject,
        });
      });

      // Determine API endpoint based on log type
      const apiEndpoints = {
        firewall: 'http://172.20.10.4:8000/firewall_predict',
        system: 'http://172.20.10.4:8000/system_predict',
        cloud: 'http://172.20.10.4:8000/cloud_predict',
      };

      const response = await fetch(apiEndpoints[logType] || '', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: { 'Content-Type': 'application/json' },
      });

      const text = await response.json();

      dispatch(setPara1(text.predictions.allow));
      dispatch(setPara2(text.predictions.deny));
      dispatch(setPara3(text.predictions.drop));

      let responseMsg =
        text.predictions.allow > 0
          ? 'Anomalies detected in log file'
          : 'Log file is secure';

      dispatch(setMsg(responseMsg));
      toast({
        title: response.ok ? 'Upload successful' : 'Upload failed',
        description: responseMsg,
        status: response.ok ? 'success' : 'error',
        duration: 10000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error during file submission:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return <Box {...props} mb="20px" align="center" p="20px"></Box>;
}
