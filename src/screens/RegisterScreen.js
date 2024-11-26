
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Animated, Easing } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../services/firebase';
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { } = useContext(AuthContext); // Puedes usar funciones del contexto si es necesario

  const handleRegister = async () => {
    try {
      if (!auth) {
        throw new Error('El objeto auth no está inicializado. Verifica la configuración de Firebase.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        id_usuario: user.uid,
        informacion_personal: {
          correo: email,
          contraseña: password,
          foto_perfil_url: "",
          fecha_nacimiento: null,
          genero: ""
        },
        medidas_fisicas: {
          peso_kg: null,
          altura_cm: null,
          nivel_actividad: ""
        },
        preferencias: {
          preferencias_dietarias: [],
          condiciones_salud: []
        },
        objetivos: {
          tipo_objetivo: ""
        }
      });

      await AsyncStorage.setItem('usuarioId', user.uid);
      console.log('User ID saved in AsyncStorage:', user.uid);

      console.log('User created and user ID saved successfully!');
    } catch (error) {
      console.error('Authentication error:', error.message);
      setError('Error de Autenticación: ' + error.message);
    }
  };

  // Animación para los iconos
  const spinValue = new Animated.Value(0);
  Animated.loop(
    Animated.timing(
      spinValue,
      {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true
      }
    )
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome5 name="carrot" size={50} color="#fff" />
      </Animated.View>
      {/* <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome5 name="apple-alt" size={50} color="#fff" />
      </Animated.View>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <FontAwesome5 name="lemon" size={50} color="#fff" />
      </Animated.View> */}
      <View style={styles.authContainer}>
        <Text style={styles.title}>Registrarse</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Correo Electrónico"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Registrarse" onPress={handleRegister} color="#3498db" />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.toggleText} onPress={() => navigation.navigate('LoginScreen')}>
            ¿Ya tienes una cuenta? Inicia Sesión
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    elevation: 3,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default RegisterScreen;