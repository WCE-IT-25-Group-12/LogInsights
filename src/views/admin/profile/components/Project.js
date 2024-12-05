// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Image,
  Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card.js';
import React from 'react';
// Assets
import { MdEdit } from 'react-icons/md';

export default function Project(props) {
  const { title, ranking, link, image, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';
  const brandColor = useColorModeValue('brand.500', 'white');
  const bg = useColorModeValue('white', 'navy.700');
  return (
    <Card bg={bg} {...rest} p="14px">
      <Flex align="center" direction={{ base: 'column', md: 'row' }}>
        <Image h="60px" w="60px" src={image} borderRadius="8px" me="20px" />
        <Box mt={{ base: '10px', md: '0' }}>
          <Text
            color={textColorPrimary}
            fontWeight="500"
            fontSize="lg"
            mb="4px"
          >
            {title}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}
