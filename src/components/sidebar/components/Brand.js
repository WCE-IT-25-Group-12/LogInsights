import React from 'react';

// Chakra imports
import { Flex, Image, useColorModeValue } from '@chakra-ui/react';
import logo from '../../../assets/img/dark.png';
// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex align="center" direction="column">
      <Image src={logo} alt="Logo" width="200px" height="auto" />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
