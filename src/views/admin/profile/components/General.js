// Chakra imports
import { SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import React from 'react';
import { useSelector } from 'react-redux';
import Information from 'views/admin/profile/components/Information';

// Assets
export default function GeneralInformation(props) {
  const { ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );
  return (
    <Card mb={{ base: '0px', '2xl': '20px' }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        General Information
      </Text>
      <Text color={textColorSecondary} fontSize="lg" me="26px" mb="40px">
        LogInsights provides an intelligent solution to monitor and safeguard
        your systems by analyzing log files. It identifies potential security
        threats and detects signs of cyber attacks through advanced algorithms
        that examine the logs for patterns indicative of malicious activity.
        This allows you to proactively address any security concerns and protect
        your infrastructure. Below are the types of logs supported by our
        software:
      </Text>
      <SimpleGrid columns="2" gap="20px">
        <Information
          boxShadow={cardShadow}
          title="Detect unauthorized access attempts."
          value="Firewall Logs"
        />
        <Information
          boxShadow={cardShadow}
          title="Monitor suspicious activities on Linux systems"
          value="Linux System Logs"
        />
        <Information
          boxShadow={cardShadow}
          title="Track anomalies in Windows systems"
          value="Windows System Logs"
        />
        <Information
          boxShadow={cardShadow}
          title="Identify security risks in AWS environments"
          value="AWS Logs"
        />
      </SimpleGrid>
    </Card>
  );
}
