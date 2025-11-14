'use client';

import { Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import {  useState } from "react";
import { getProfile, postLogin, postRegister } from "../service";

export const LoginContainer = () => {
  return (
    <Flex direction="column" gap="4">
      <RegisterForm />
      <LoginForm />
      <UserPanel />
    </Flex>
  );
};

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  
  const handleRegister = () => {
    console.log('register', email, password, name);
    postRegister({email, password, name}).then((res)=> setResult(JSON.stringify(res))).catch(error=> {
      alert(error?.message || 'error')
      setError(error?.message || 'error')
    })
  }

  return (
    <Card>
      <Flex direction="column" gap="4">
        <Text>Register Form</Text>
        <Text className="text-red-500">{error}</Text>
        <TextField.Root placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></TextField.Root>
        <TextField.Root placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></TextField.Root>
        <TextField.Root placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}></TextField.Root>
        <Button onClick={handleRegister}>Register</Button>
        <Text>{result}</Text>
      </Flex>
    </Card>
  );
};

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  
  const handleLogin = () => {
    console.log('login', email, password);
    postLogin({email, password}).then((res)=> setResult(JSON.stringify(res))).catch(error=> {
      alert(error?.message || 'error')
      setError(error?.message || 'error')
    })
  }

  return (
    <Card>
      <Flex direction="column" gap="4">
        <h1>Login Form</h1>
        <Text className="text-red-500">{error}</Text>
        <TextField.Root placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></TextField.Root>
        <TextField.Root placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></TextField.Root>
        <Button onClick={handleLogin}>Login</Button>
        <Text>{result}</Text>
      </Flex>
    </Card>
  );
};

const UserPanel = () => {
  const [token, setToken] = useState('');
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  
  const handleProfile = () => {
    if(!token) return
    getProfile(token).then((res)=> setResult(JSON.stringify(res))).catch(error=> {
      alert(error?.message || 'error')
      setError(error?.message || 'error')
    })
  }

  return (
    <Card>
      <Flex direction="column" gap="4">
        <h1>Get Profile</h1>
        <Text className="text-red-500">{error}</Text>
        <TextField.Root placeholder="Bearer Token" value={token} onChange={(e) => setToken(e.target.value)}></TextField.Root>
        <Button onClick={handleProfile}>Get</Button>
        <Text>{result}</Text>
      </Flex>
    </Card>
  );
};
