import { FamilyData } from '../types/family';

export const sampleFamilyData: FamilyData = {
  rootId: "1",
  members: {
    // First Generation
    "1": {
      id: "1",
      name: "Rajesh Kumar",
      teluguName: "రాజేష్ కుమార్",
      birthYear: "1910",
      deathYear: "1985",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["3", "4", "5"],
      partnerId: "2",
      marriageYear: "1930",
      biography: "Founded the Kumar Industries in 1935. Philanthropist who established several educational institutions.",
      gender: "male"
    },
    "2": {
      id: "2",
      name: "Lakshmi Kumar",
      teluguName: "లక్ష్మి కుమార్",
      birthYear: "1915",
      deathYear: "1990",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["3", "4", "5"],
      partnerId: "1",
      biography: "Classical dancer and patron of arts. Started the first women's college in the region.",
      gender: "female"
    },

    // Second Generation
    "3": {
      id: "3",
      name: "Venkat Kumar",
      teluguName: "వెంకట్ కుమార్",
      birthYear: "1935",
      deathYear: "2010",
      imageUrl: "",
      parentIds: ["1", "2"],
      childrenIds: ["8", "9"],
      partnerId: "6",
      marriageYear: "1960",
      biography: "Expanded Kumar Industries internationally. Known for revolutionary manufacturing processes.",
      gender: "male"
    },
    "4": {
      id: "4",
      name: "Priya Reddy",
      teluguName: "ప్రియా రెడ్డి",
      birthYear: "1938",
      imageUrl: "",
      parentIds: ["1", "2"],
      childrenIds: ["10", "11"],
      partnerId: "7",
      marriageYear: "1963",
      biography: "Renowned cardiothoracic surgeon. Established free healthcare camps across rural areas.",
      gender: "female"
    },
    "5": {
      id: "5",
      name: "Arun Kumar",
      teluguName: "అరుణ్ కుమార్",
      birthYear: "1940",
      imageUrl: "",
      parentIds: ["1", "2"],
      childrenIds: ["12", "13", "14"],
      partnerId: "15",
      marriageYear: "1965",
      biography: "Environmental scientist. Led major conservation projects in Western Ghats.",
      gender: "male"
    },
    "6": {
      id: "6",
      name: "Maya Kumar",
      teluguName: "మాయా కుమార్",
      birthYear: "1938",
      deathYear: "2015",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["8", "9"],
      partnerId: "3",
      biography: "Award-winning author of historical novels.",
      gender: "female"
    },
    "7": {
      id: "7",
      name: "Krishna Reddy",
      teluguName: "కృష్ణ రెడ్డి",
      birthYear: "1936",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["10", "11"],
      partnerId: "4",
      biography: "Former Supreme Court Justice. Pioneered environmental law in India.",
      gender: "male"
    },

    // Third Generation
    "8": {
      id: "8",
      name: "Arjun Kumar",
      teluguName: "అర్జున్ కుమార్",
      birthYear: "1965",
      imageUrl: "",
      parentIds: ["3", "6"],
      childrenIds: ["16", "17"],
      partnerId: "18",
      marriageYear: "1990",
      biography: "CEO of Kumar Industries. Forbes 500 entrepreneur.",
      gender: "male"
    },
    "9": {
      id: "9",
      name: "Kiran Kumar",
      teluguName: "కిరణ్ కుమార్",
      birthYear: "1968",
      imageUrl: "",
      parentIds: ["3", "6"],
      childrenIds: ["19"],
      biography: "NASA scientist working on Mars colonization projects.",
      gender: "male"
    },
    "10": {
      id: "10",
      name: "Anjali Reddy",
      teluguName: "అంజలి రెడ్డి",
      birthYear: "1966",
      imageUrl: "",
      parentIds: ["4", "7"],
      childrenIds: ["20", "21"],
      partnerId: "22",
      marriageYear: "1992",
      biography: "Nobel laureate in Medicine for cancer research.",
      gender: "female"
    },
    "11": {
      id: "11",
      name: "Deepak Reddy",
      teluguName: "దీపక్ రెడ్డి",
      birthYear: "1970",
      imageUrl: "",
      parentIds: ["4", "7"],
      childrenIds: [],
      marriageYear: "1995",
      biography: "Olympic gold medalist in badminton. Now coaches national team.",
      gender: "male"
    },
    "12": {
      id: "12",
      name: "Ravi Kumar",
      teluguName: "రవి కుమార్",
      birthYear: "1968",
      imageUrl: "",
      parentIds: ["5", "15"],
      childrenIds: [],
      marriageYear: "1993",
      biography: "Tech entrepreneur, founded multiple AI startups.",
      gender: "male"
    },
    "13": {
      id: "13",
      name: "Sanjay Kumar",
      teluguName: "సంజయ్ కుమార్",
      birthYear: "1970",
      imageUrl: "",
      parentIds: ["5", "15"],
      childrenIds: [],
      biography: "Buddhist monk and mindfulness author.",
      gender: "male"
    },
    "14": {
      id: "14",
      name: "Meera Kumar",
      teluguName: "మీరా కుమార్",
      birthYear: "1972",
      imageUrl: "",
      parentIds: ["5", "15"],
      childrenIds: [],
      marriageYear: "1997",
      biography: "UN Goodwill Ambassador and social activist.",
      gender: "female"
    },
    "15": {
      id: "15",
      name: "Anita Kumar",
      teluguName: "అనిత కుమార్",
      birthYear: "1942",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["12", "13", "14"],
      partnerId: "5",
      biography: "Classical vocalist and music teacher.",
      gender: "female"
    },

    // Fourth Generation
    "16": {
      id: "16",
      name: "Rohan Kumar",
      teluguName: "రోహన్ కుమార్",
      birthYear: "1992",
      imageUrl: "",
      parentIds: ["8", "18"],
      childrenIds: [],
      username: "rohan_k",
      biography: "Quantum computing researcher at Google.",
      gender: "male"
    },
    "17": {
      id: "17",
      name: "Neha Kumar",
      teluguName: "నేహా కుమార్",
      birthYear: "1995",
      imageUrl: "",
      parentIds: ["8", "18"],
      childrenIds: [],
      username: "neha_k",
      biography: "Climate change activist and renewable energy expert.",
      gender: "female"
    },
    "18": {
      id: "18",
      name: "Priyanka Kumar",
      teluguName: "ప్రియాంక కుమార్",
      birthYear: "1970",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["16", "17"],
      partnerId: "8",
      biography: "Chief Justice of State High Court.",
      gender: "female"
    },
    "19": {
      id: "19",
      name: "Aditya Kumar",
      teluguName: "ఆదిత్య కుమార్",
      birthYear: "1995",
      imageUrl: "",
      parentIds: ["9"],
      childrenIds: [],
      username: "aditya_k",
      biography: "Professional esports player and game developer.",
      gender: "male"
    },
    "20": {
      id: "20",
      name: "Zara Reddy",
      teluguName: "జారా రెడ్డి",
      birthYear: "1993",
      imageUrl: "",
      parentIds: ["10", "22"],
      childrenIds: [],
      username: "zara_r",
      biography: "Non-binary performance artist and LGBTQ+ activist.",
      gender: "other"
    },
    "21": {
      id: "21",
      name: "Vikram Reddy",
      teluguName: "విక్రమ్ రెడ్డి",
      birthYear: "1995",
      imageUrl: "",
      parentIds: ["10", "22"],
      childrenIds: [],
      username: "vikram_r",
      biography: "Blockchain developer and cryptocurrency expert.",
      gender: "male"
    },
    "22": {
      id: "22",
      name: "Rahul Sharma",
      teluguName: "రాహుల్ శర్మ",
      birthYear: "1965",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["20", "21"],
      partnerId: "10",
      biography: "Renowned neurosurgeon and medical researcher.",
      gender: "male"
    }
  }
};