import React, { useRef } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
} from '@chakra-ui/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Result = ({ resultData }) => {
  const resultRef = useRef();

  if (!resultData) {
    return <Text>No result available. Please upload a file first.</Text>;
  }

  const {
    sheetName,
    logType,
    resultStatus,
    resultDate,
    attackProbability,
    metrics,
  } = resultData;

  const downloadPDF = () => {
    const input = resultRef.current;
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

  return (
    <>
      <Card p={6} boxShadow="xl" borderRadius="2xl" mt={6} ref={resultRef}>
        <CardHeader>
          <Heading size="lg" mb={4}>
            Upload Result Summary
          </Heading>
          <Text mb="1">
            <strong>Sheet Name:</strong> {sheetName}
          </Text>
          <Text mb="1">
            <strong>Type of Logs:</strong> {logType}
          </Text>
          <Text mb="1">
            <strong>Result:</strong> {resultStatus}
          </Text>
          <Text mb="1">
            <strong>Date of Result:</strong>{' '}
            {new Date(resultDate).toLocaleString()}
          </Text>
          <Text mb="1">
            <strong>Attack Probability:</strong> {attackProbability}%
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
              {metrics.map((metric, index) => (
                <Tr key={index}>
                  <Td border="1px solid">{metric.name}</Td>
                  <Td border="1px solid">{metric.value}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Button onClick={downloadPDF} colorScheme="blue" mt={4}>
        Download as PDF
      </Button>
    </>
  );
};

export default Result;
