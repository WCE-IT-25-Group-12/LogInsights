import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Select,
  Text,
  Spinner,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
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
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [msg, setMsg] = useState('');
  const toast = useToast();
  const dispatch = useDispatch();

  const handleLogTypeChange = (event) => {
    const selectedLogType = event.target.value;
    console.log('Selected log type:', selectedLogType);
    setLogType(selectedLogType);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      console.log('Uploaded file:', uploadedFile);
      setFile(uploadedFile);
    },
    accept: '.csv',
    disabled: loading,
  });

  const convertCSVToJSON = (csvFile) => {
    console.log('Converting CSV to JSON...');
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        complete: (result) => {
          console.log('Parsed JSON data:', result.data);
          resolve(result.data);
        },
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        error: (err) => {
          console.error('Error parsing CSV:', err);
          reject(err);
        },
      });
    });
  };

  const handleSubmit = async () => {
    console.log('Submitting form...');
    if (!file) {
      console.warn('No file uploaded.');
      toast({
        title: 'No file uploaded',
        description: 'Please upload a CSV file.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!logType) {
      console.warn('No log type selected.');
      toast({
        title: 'No log type selected',
        description: 'Please select a log type.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Converting file to JSON...');
      const jsonData = await convertCSVToJSON(file);

      console.log('JSON data to be sent:', jsonData);
      const response = await fetch('http://172.20.10.4:8000/predict', {
        method: 'POST',
        body: JSON.stringify(jsonData),
        headers: {
          'Content-type': 'application/json',
        },
      });

      const text = await response.json();
      console.log(
        'Response from server:',
        text.predictions,
        text.predictions.allow,
        text.predictions.deny,
        text.predictions.drop,
      );
      dispatch(setPara1(text.predictions.allow));
      dispatch(setPara2(text.predictions.deny));
      dispatch(setPara3(text.predictions.drop));

      let responseMsg = '';

      if (text === 'Predictions: 0.0') {
        responseMsg = 'There is no anomaly in the log file. It is secure.';
      } else if (text === 'Predictions: 1.0') {
        responseMsg = 'There is an anomaly in the log file. It is not secure.';
      } else if (text === 'Predictions: 2.0') {
        responseMsg = 'There is an anomaly in the log file. It is not secure.';
      } else {
        responseMsg = '';
      }

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
      console.log('Form submission completed.');
      setLoading(false);
    }
  };

  const { ...rest } = props;
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';

  return (
    <Box {...rest} mb="20px" align="center" p="20px">
      <Flex direction="column" align="center">
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
          width="300px"
          height="150px"
          bg={loading ? 'gray.100' : 'transparent'}
        >
          <input {...getInputProps()} />
          {loading ? (
            <Spinner color="brand.500" size="lg" />
          ) : (
            <Text fontSize="lg" color={textColorPrimary}>
              Drag and drop a file, or click to select a file
            </Text>
          )}
          {file && !loading && (
            <Text mt="10px" color={textColorSecondary}>
              {file.name}
            </Text>
          )}
        </Flex>

        <Box width="300px" mt="4" mb="4">
          <Select
            placeholder="Select log type"
            value={logType}
            onChange={handleLogTypeChange}
            isDisabled={loading}
          >
            <option value="firewall">Firewall Logs</option>
            <option value="system">System Logs</option>
            <option value="cloud">Cloud Logs</option>
          </Select>
        </Box>

        <Button
          mt="20px"
          variant="brand"
          fontWeight="500"
          onClick={handleSubmit}
          isLoading={loading}
          isDisabled={loading}
        >
          Submit
        </Button>
      </Flex>
    </Box>
  );
}
