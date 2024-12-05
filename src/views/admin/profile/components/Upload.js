import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Select,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { MdUpload } from 'react-icons/md';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse'; // Import the papaparse library

export default function Upload(props) {
  const [logType, setLogType] = useState('');
  const [file, setFile] = useState(null);
  const toast = useToast();
  const [err, setErr] = useState('');

  // Handle the log type change
  const handleLogTypeChange = (event) => {
    setLogType(event.target.value);
    console.log('Selected log type:', event.target.value);
  };

  // Handle the file upload
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile); // Storing the uploaded file
    },
    accept: '.csv', // Restrict file types if necessary
  });

  // Function to convert CSV to JSON
  const convertCSVToJSON = (csvFile) => {
    return new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        complete: (result) => {
          resolve(result.data); // Returns parsed JSON
        },
        header: true, // Use the first row as headers
        skipEmptyLines: true, // Skip empty lines
        dynamicTyping: true, // Automatically detect and convert data types
        error: (err) => reject(err),
      });
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'No file uploaded',
        description: 'Please upload a CSV file.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Check if the file is a CSV
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setFile(null);
      toast({
        title: 'Invalid file type',
        description: 'Please upload a valid CSV file.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!logType) {
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
      const jsonData = await convertCSVToJSON(file); // Convert CSV to JSON

      const formData = new FormData();
      formData.append('file', JSON.stringify(jsonData)); // Append JSON data
      formData.append('logType', logType);

      console.log('jsonData', jsonData[0]);

      const response = await fetch('http://172.20.10.4:8000/predict', {
        method: 'POST',
        body: JSON.stringify(jsonData[0]),
        headers: {
          'Content-type': 'application/json',
        },
      });
      const text = await response.text();
      console.log(text);
      if (response.ok) {
        toast({
          title: 'Upload successful',
          description: 'Your file has been uploaded successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const { used, total, ...rest } = props;
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const textColorSecondary = 'gray.400';

  return (
    <Box {...rest} mb="20px" align="center" p="20px">
      <Flex h="100%" direction={{ base: 'column', '2xl': 'row' }}>
        {/* File Upload Dropzone */}
        <Flex
          {...getRootProps()}
          border="2px dashed"
          borderColor="gray.400"
          p="20px"
          textAlign="center"
          borderRadius="lg"
          cursor="pointer"
          direction={{ base: 'column' }}
          align="center"
          justify="center"
          height="100%"
          mr="10"
        >
          <input {...getInputProps()} />
          <Text fontSize="lg" color={textColorPrimary}>
            Drag and drop a file, or click to select a file
          </Text>
          {file && (
            <Text mt="10px" color={textColorSecondary}>
              {file.name}
            </Text>
          )}
        </Flex>

        <Flex direction="column" pe="44px" mt="20px">
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            textAlign="start"
            fontSize="2xl"
            mt="50px"
          >
            Upload the Log File and select log type
          </Text>
          <Text
            color={textColorSecondary}
            fontSize="md"
            my="10px"
            mx="auto"
            textAlign="start"
          >
            {err}
          </Text>
          <Box width="300px" margin="0 auto" mt="4" mb="4">
            <Select
              placeholder="Select log type"
              value={logType}
              onChange={handleLogTypeChange}
            >
              <option value="firewall">Firewall Logs</option>
              <option value="system">System Logs</option>
              <option value="cloud">Cloud Logs</option>
            </Select>
          </Box>
          <Flex w="100%">
            <Button
              me="100%"
              mb="50px"
              w="140px"
              minW="140px"
              mt="20px"
              variant="brand"
              fontWeight="500"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
