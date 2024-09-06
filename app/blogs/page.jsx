import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StatusBar, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

const categories = ['Anxiety', 'Depression', 'Stress', 'Well-being'];

// Sample JSON object containing blog data
const sampleBlogData = [
  {
    id: 1,
    title: 'Comprendre l\'anxiété',
    body: 'L\'anxiété est une réaction normale au stress et peut être bénéfique dans certaines situations.',
    imageUrl: 'https://images.pexels.com/photos/4672710/pexels-photo-4672710.jpeg'
  },
  {
    id: 2,
    title: 'Lutter contre la dépression',
    body: 'La dépression est un trouble de l\'humeur fréquent mais grave. Elle affecte la façon dont vous vous sentez, pensez et gérez les activités quotidiennes.',
    imageUrl: 'https://images.pexels.com/photos/4672710/pexels-photo-4672710.jpeg'
  },
  {
    id: 3,
    title: 'Gérer le stress',
    body: 'Le stress est une réaction physique et mentale naturelle aux expériences de la vie.',
    imageUrl: 'https://images.pexels.com/photos/4672710/pexels-photo-4672710.jpeg'
  },
  {
    id: 4,
    title: 'Bien-être et santé mentale',
    body: 'Le bien-être est un état de santé physique, mentale et sociale complète.',
    imageUrl: 'https://images.pexels.com/photos/4672710/pexels-photo-4672710.jpeg'
  }
];

const BlogScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'outfit': require('../../assets/fonts/Outfit-Regular.ttf'),
    'outfit-bold': require('../../assets/fonts/Outfit-Bold.ttf'),
    'outfit-medium': require('../../assets/fonts/Outfit-Medium.ttf'),
  });
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const blogsWithImages = sampleBlogData.map(blog => ({
        ...blog,
        imageUrl: blog.imageUrl // Use predefined image URLs
      }));
      
      const translatedBlogs = await translateBlogs(blogsWithImages);
      setBlogs(translatedBlogs);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setLoading(false);
    }
  };

  const translateBlogs = async (blogs) => {
    const translatedBlogs = await Promise.all(blogs.map(async (blog) => {
      const translatedTitle = await translateText(blog.title, 'fr', 'en');
      const translatedBody = await translateText(blog.body, 'fr', 'en');
      return { ...blog, title: translatedTitle, body: translatedBody };
    }));
    return translatedBlogs;
  };

  const translateText = async (text, sourceLang, targetLang) => {
    // Mock translation function for demonstration purposes
    const translations = {
      'Comprendre l\'anxiété': 'Understanding Anxiety',
      'Lutter contre la dépression': 'Fighting Depression',
      'Gérer le stress': 'Managing Stress',
      'Bien-être et santé mentale': 'Well-being and Mental Health',
      'L\'anxiété est une réaction normale au stress et peut être bénéfique dans certaines situations.': 'Anxiety is a normal reaction to stress and can be beneficial in some situations.',
      'La dépression est un trouble de l\'humeur fréquent mais grave. Elle affecte la façon dont vous vous sentez, pensez et gérez les activités quotidiennes.': 'Depression is a common but serious mood disorder. It affects how you feel, think, and handle daily activities.',
      'Le stress est une réaction physique et mentale naturelle aux expériences de la vie.': 'Stress is a natural physical and mental reaction to life experiences.',
      'Le bien-être est un état de santé physique, mentale et sociale complète.': 'Well-being is a state of complete physical, mental, and social health.'
    };
    return translations[text] || text; // Return translated text or original text if translation is not found
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={tw`bg-white  rounded-lg mr-3 shadow`}>
      <Text style={tw`text-lg font-semibold`}>{item}</Text>
    </TouchableOpacity>
  );

  const renderBlogItem = ({ item }) => (
    <View style={tw`bg-white p-4 rounded-lg mb-4 shadow mt-3`}>
      <Image source={{ uri: item.imageUrl }} style={tw`w-full h-40 rounded-lg mb-4`} />
      <Text style={[tw`text-xl font-bold mb-2`, { fontFamily: 'outfit-bold' }]}>{item.title}</Text>
      <Text style={[tw`text-base`, { fontFamily: 'outfit' }]}>{item.body}</Text>
    </View>
  );

  if (!fontsLoaded) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      <StatusBar barStyle="dark-content" backgroundColor="#6B21A8" />
      <View style={tw`flex-row items-center py-8 justify-center bg-purple-800 mt-8`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-circle-outline" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[tw`text-white text-2xl ml-4`, { fontFamily: 'outfit-bold' }]}>Read Blogs</Text>
      </View>
      {/* <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={tw`mt-4 mb-4`}
      /> */}
      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.id.toString()}
        style={tw`p-4`}
      />
    </View>
  );
};

export default BlogScreen;
