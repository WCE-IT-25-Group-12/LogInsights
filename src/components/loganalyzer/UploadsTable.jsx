import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Heading,
} from '@chakra-ui/react';
import { FiDownload } from 'react-icons/fi';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function UploadsTable({ uploads }) {
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.300');
  const bg = useColorModeValue('white', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const resultRef = useRef(null);
  const [selectedUpload, setSelectedUpload] = useState(null);

  const downloadPDF = () => {
    const input = resultRef.current;
    if (!input) return;
    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('result-summary.pdf');
      })
      .catch((err) => {
        console.error('Error generating PDF', err);
      });
  };

  const handleDownload = (upload) => {
    setSelectedUpload(upload);

    setTimeout(() => {
      downloadPDF();
    }, 300); // small timeout to let the hidden component render
  };

  return (
    <Box
      bg={bg}
      borderRadius="xl"
      p="6"
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
      overflowX="auto"
      position="relative"
    >
      <Text fontSize="xl" fontWeight="bold" color={textColorPrimary} mb="6">
        Uploaded Logs
      </Text>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th color={textColorSecondary}>Sheet Name</Th>
            <Th color={textColorSecondary}>Log Type</Th>
            <Th color={textColorSecondary}>Result Status</Th>
            <Th color={textColorSecondary}>Attack Probability</Th>
            <Th color={textColorSecondary}>Date</Th>
            <Th color={textColorSecondary} textAlign="center">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {uploads.map((upload, index) => (
            <Tr key={index}>
              <Td color={textColorPrimary}>{upload.sheetName}</Td>
              <Td color={textColorPrimary}>{upload.logType}</Td>
              <Td color={textColorPrimary}>{upload.resultStatus}</Td>
              <Td color={textColorPrimary}>{upload.attackProbability}%</Td>
              <Td color={textColorPrimary}>
                {new Date(upload.resultDate).toLocaleDateString()}
              </Td>
              <Td textAlign="center">
                <Button
                  leftIcon={<FiDownload />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(upload)}
                >
                  PDF
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Hidden Card for PDF Generation */}
      {selectedUpload && (
        <Box
          position="absolute"
          top="-9999px"
          left="-9999px"
          width="800px"
          ref={resultRef}
        >
          <Card p={6} boxShadow="xl" borderRadius="2xl" mt={6}>
            <CardHeader>
              <Heading size="lg" mb={4}>
                Upload Result Summary
              </Heading>
              <Text mb="1">
                <strong>Sheet Name:</strong> {selectedUpload.sheetName}
              </Text>
              <Text mb="1">
                <strong>Type of Logs:</strong> {selectedUpload.logType}
              </Text>
              <Text mb="1">
                <strong>Result:</strong> {selectedUpload.resultStatus}
              </Text>
              <Text mb="1">
                <strong>Date of Result:</strong>{' '}
                {new Date(selectedUpload.resultDate).toLocaleString()}
              </Text>
              <Text mb="1">
                <strong>Attack Probability:</strong>{' '}
                {selectedUpload.attackProbability}%
              </Text>
            </CardHeader>

            <CardBody>
              <Heading size="md" mb={4}>
                Metrics
              </Heading>
              <Table variant="simple">
                <Thead border="1px solid">
                  <Tr>
                    <Th border="1px solid">Metric Name</Th>
                    <Th border="1px solid">Value</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedUpload.metrics?.map((metric, index) => (
                    <Tr key={index}>
                      <Td border="1px solid">{metric.name}</Td>
                      <Td border="1px solid">{metric.value}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
          </Card>
        </Box>
      )}
    </Box>
  );
}
