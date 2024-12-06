// chakra imports
import { Box, Flex, Stack } from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import React from 'react';
import { useSelector } from 'react-redux'; // Import useSelector

// FUNCTIONS

function SidebarContent(props) {
  const { routes } = props;

  // Select signedIn state from Redux
  const signedIn = useSelector((state) => state.auth.signedIn);

  // SIDEBAR
  return (
    <Flex
      direction="column"
      height="100%"
      pt="25px"
      px="16px"
      borderRadius="30px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: '16px', '2xl': '1px' }}>
          {/* Pass signedIn as a prop */}
          <Links routes={routes} signedIn={signedIn} />
        </Box>
      </Stack>

      <Box mt="60px" mb="40px" borderRadius="30px">
        <SidebarCard />
      </Box>
    </Flex>
  );
}

export default SidebarContent;
