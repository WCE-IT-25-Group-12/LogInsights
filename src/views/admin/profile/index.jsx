import {
  Box,
  Flex,
  Grid,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

// Custom components
import Banner from 'views/admin/profile/components/Banner';
import General from 'views/admin/profile/components/General';
import Notifications from 'views/admin/profile/components/Notifications';
import Projects from 'views/admin/profile/components/Projects';
import Storage from 'views/admin/profile/components/Storage';
import Upload from 'views/admin/profile/components/Upload';

// Assets
import banner from 'assets/img/auth/banner.png';
import avatar from 'assets/img/avatars/avatar4.png';
import { useState } from 'react';
import Information from './components/Information';
import { useSelector } from 'react-redux';

export default function Overview() {
  const textColorPrimary = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'gray.400';

  const msg = useSelector((state) => state.auth.msg);
  const allow = useSelector((state) => state.auth.para1);
  const deny = useSelector((state) => state.auth.para2);
  const drop = useSelector((state) => state.auth.para3);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '1.34fr 1fr 1.62fr',
        }}
        templateRows={{
          base: 'repeat(3, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Banner
          gridArea="1 / 1 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name="Team 12"
          job="Final Year Information Technology"
          posts="17"
          followers="9.7k"
          following="274"
        />
        <Storage
          gridArea={{ base: '2 / 1 / 3 / 2', lg: '1 / 2 / 2 / 3' }}
          used={25.6}
          total={50}
        />
        <Upload
          gridArea={{
            base: '3 / 1 / 4 / 2',
            lg: '1 / 3 / 2 / 4',
          }}
          minH={{ base: 'auto', lg: '420px', '2xl': '365px' }}
          pe="20px"
          pb={{ base: '100px', lg: '20px' }}
        />
      </Grid>

      <Grid
        mb="20px"
        templateColumns="repeat(3, 1fr)" // Three equal columns
        gap="20px" // Space between boxes
      >
        <Box
          backgroundColor="green"
          color="white"
          p="20px"
          textAlign="center"
          borderRadius="1rem"
        >
          <Flex direction="column" align="center" justify="center">
            <Text fontSize="4xl" fontWeight="bold">
              {allow}
            </Text>{' '}
            {/* Large number */}
            <Text fontSize="md">Allow</Text> {/* Medium font text */}
          </Flex>
        </Box>

        <Box
          backgroundColor="red"
          color="white"
          p="20px"
          textAlign="center"
          borderRadius="1rem"
        >
          <Flex direction="column" align="center" justify="center">
            <Text fontSize="4xl" fontWeight="bold">
              {deny}
            </Text>{' '}
            {/* Large number */}
            <Text fontSize="md">Deny</Text> {/* Medium font text */}
          </Flex>
        </Box>
        <Box
          backgroundColor="black"
          color="white"
          p="20px"
          textAlign="center"
          borderRadius="1rem"
        >
          <Flex direction="column" align="center" justify="center">
            <Text fontSize="4xl" fontWeight="bold">
              {drop}
            </Text>{' '}
            {/* Large number */}
            <Text fontSize="md">Drop</Text> {/* Medium font text */}
          </Flex>
        </Box>
      </Grid>

      <Grid
        mb="20px"
        templateColumns={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
          '2xl': '1.34fr 2.68fr', // Adjusted to take up the space
        }}
        templateRows={{
          base: '1fr',
          lg: 'repeat(2, 1fr)',
          '2xl': '1fr', // One row for both components
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Projects
          gridArea="1 / 1 / 2 / 2" // Adjusted grid area to span both columns
          banner={banner}
          avatar={avatar}
          name="Team 12"
          job="Final Year Information Technology"
          posts="17"
          followers="9.7k"
          following="274"
        />
        <General
          gridArea="1 / 2 / 2 / 3" // Adjusted grid area to span both columns
          minH="365px"
          pe="20px"
        />
      </Grid>
    </Box>
  );
}
