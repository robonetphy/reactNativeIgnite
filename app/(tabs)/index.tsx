import { Text, View, StyleSheet,Pressable } from 'react-native';
import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import forge from 'node-forge';
export default function Index() {
  const [APIResponse, setAPIResponse] = useState('');
  const [publicKey, setPublicKey] = useState(null);

    // Encrypt string using the fetched public key with RSA-OAEP
  const encryptString = (plaintext: string): string | null => {
    if (!publicKey) {
      console.error('Public key not available');
      return null;
    }

    try {
      // Convert the public key from PEM format
      const publicKeyForge = forge.pki.publicKeyFromPem(publicKey);
    // Encrypt using OAEP padding with SHA-256
          const encrypted = publicKeyForge.encrypt(plaintext, 'RSA-OAEP', {
            md: forge.md.sha256.create(),
      });
      // Convert encrypted data to a Base64 string
      return forge.util.encode64(encrypted);
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  };
  const email = "1998patelumang@gmail.com";
  const password = "Umang@123";
  const username = "robonetphy";
  const user_agent = navigator.userAgent;
  const testRegister = async () => {
    try {
      const encryptedPassword = await encryptString(password);
      axios.post("http://192.168.29.202:8080/user/register",  {
        email,
        password:encryptedPassword,
        username,
        user_agent
      })
      .then((response) => {
        setAPIResponse(response.data);
      })
      .catch((error) => {
        console.error('Error during signup:', error);
        setAPIResponse(error);
      });
    } catch (error) {
      console.error('Encryption error:', error);
    }
  }
  const testLoginWithEmail = async () => {
    try {
      const encryptedPassword = await encryptString(password);
      axios.post("http://192.168.29.202:8080/user/login",  {
        email,
        password:encryptedPassword,
        user_agent
      })
      .then((response) => {
        setAPIResponse(response.data);
      })
      .catch((error) => {
        console.error('Error during signup:', error);
        setAPIResponse(error);
      });
    } catch (error) {
      console.error('Encryption error:', error);
    }
  }
  const testLoginWithUserName = async () => {
    try {
      const encryptedPassword = await encryptString(password);
      axios.post("http://192.168.29.202:8080/user/login",  {
        password:encryptedPassword,
        username,
        user_agent
      })
      .then((response) => {
        setAPIResponse(response.data);
      })
      .catch((error) => {
        console.error('Error during signup:', error);
        setAPIResponse(error);
      });
    } catch (error) {
      console.error('Encryption error:', error);
    }
  }
  
  // Fetch the public key from the API when the component mounts
  useEffect(() => {
    axios
      .get('http://192.168.29.202:8080/key/public')
      .then((response) => {
        setPublicKey(response.data.public_key); // Adjust this if the key is nested within the response object
      })
      .catch((error) => {
        console.error('Error fetching public key:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {APIResponse}
      </Text>
      <Pressable onPress={testRegister}>
        <Text style={styles.text}>Test Register</Text>
      </Pressable>
      <Pressable onPress={testLoginWithEmail}>
        <Text style={styles.text}>Test Login with Email</Text>
      </Pressable>

      <Pressable onPress={testLoginWithUserName}>
        <Text style={styles.text}>Test Login with userName</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});