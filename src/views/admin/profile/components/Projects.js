// Chakra imports
import { Text, useColorModeValue } from '@chakra-ui/react';
// Assets
import Project1 from 'assets/img/profile/Project1.png';
import Project2 from 'assets/img/profile/Project2.png';
import Project3 from 'assets/img/profile/Project3.png';
// Custom components
import Card from 'components/card/Card.js';
import React from 'react';
import Project from 'views/admin/profile/components/Project';

export default function Projects(props) {
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );
  return (
    <Card mb={{ base: '0px', '2xl': '20px' }}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        Features provided
      </Text>
      <Text color={textColorSecondary} fontSize="lg" me="26px" mb="40px">
        Below are the key features available on our website to enhance your
        experience:
      </Text>
      <Project
        boxShadow={cardShadow}
        mb="20px"
        image={Project1}
        ranking="1"
        link="#"
        title="Cyber Attack detection"
      />
      <Project
        boxShadow={cardShadow}
        mb="20px"
        image={Project2}
        ranking="2"
        link="#"
        title="Anamoly detection"
      />
      <Project
        boxShadow={cardShadow}
        image={Project3}
        ranking="3"
        link="#"
        title="Visualized results"
      />
    </Card>
  );
}
