import { FamilyData } from '../types/family';

export const sampleFamilyData: FamilyData = {
  rootId: "1",
  members: {
    // First Generation
    "1": {
      id: "1",
      name: "Rajesh Patel",
      teluguName: "రాజేష్ పటేల్",
      birthYear: "1910",
      deathYear: "1985",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["3", "4", "5"],
      partnerId: "2",
      marriageYear: "1930",
      biography: "Founded the Patel Trading Company in 1935. Immigrated from Gujarat to Hyderabad in 1928.",
      gender: "male"
    },
    "2": {
      id: "2",
      name: "Lakshmi Patel",
      teluguName: "లక్ష్మి పటేల్",
      birthYear: "1915",
      deathYear: "1990",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["3", "4", "5"],
      partnerId: "1",
      biography: "Classical Bharatanatyam dancer and teacher. Established first dance academy in the region.",
      gender: "female"
    },

    // Second Generation
    "3": {
      id: "3",
      name: "Arun Patel",
      teluguName: "అరుణ్ పటేల్",
      birthYear: "1935",
      deathYear: "2010",
      imageUrl: "",
      parentIds: ["1", "2"],
      childrenIds: ["8", "9"],
      partnerId: "6",
      marriageYear: "1960",
      biography: "Expanded family business internationally. Served as Chamber of Commerce president.",
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
      biography: "Renowned pediatrician who established children's hospital.",
      gender: "female"
    },
    "5": {
      id: "5",
      name: "Vikram Patel",
      teluguName: "విక్రమ్ పటేల్",
      birthYear: "1940",
      imageUrl: "",
      parentIds: ["1", "2"],
      childrenIds: ["12"],
      biography: "Never married. Distinguished professor of Physics at IIT.",
      gender: "male"
    },
    "6": {
      id: "6",
      name: "Meera Patel",
      teluguName: "మీరా పటేల్",
      birthYear: "1938",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["8", "9"],
      partnerId: "3",
      biography: "Social activist and founder of women's empowerment NGO.",
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
      biography: "Former State Minister of Education.",
      gender: "male"
    },

    // Third Generation
    "8": {
      id: "8",
      name: "Arjun Patel",
      teluguName: "అర్జున్ పటేల్",
      birthYear: "1965",
      imageUrl: "",
      parentIds: ["3", "6"],
      childrenIds: ["15", "16"],
      partnerId: "13",
      marriageYear: "1990",
      biography: "CEO of Patel Global Enterprises. Harvard MBA graduate.",
      gender: "male"
    },
    "9": {
      id: "9",
      name: "Kiran Patel",
      teluguName: "కిరణ్ పటేల్",
      birthYear: "1968",
      imageUrl: "",
      parentIds: ["3", "6"],
      childrenIds: ["17"],
      partnerId: "14",
      marriageYear: "1995",
      biography: "Award-winning filmmaker and documentarian.",
      gender: "male"
    },
    "10": {
      id: "10",
      name: "Anjali Kumar",
      teluguName: "అంజలి కుమార్",
      birthYear: "1964",
      imageUrl: "",
      parentIds: ["4", "7"],
      childrenIds: ["18", "19"],
      partnerId: "20",
      marriageYear: "1988",
      biography: "Supreme Court advocate specializing in environmental law.",
      gender: "female"
    },
    "11": {
      id: "11",
      name: "Deepak Reddy",
      teluguName: "దీపక్ రెడ్డి",
      birthYear: "1966",
      imageUrl: "",
      parentIds: ["4", "7"],
      childrenIds: ["21"],
      biography: "Tech entrepreneur, founded successful AI startup.",
      gender: "male"
    },
    "12": {
      id: "12",
      name: "Sunita Patel",
      teluguName: "సునీత పటేల్",
      birthYear: "1970",
      imageUrl: "",
      parentIds: ["5"],
      childrenIds: [],
      biography: "Adopted daughter of Vikram. Quantum computing researcher at MIT.",
      gender: "female"
    },
    "13": {
      id: "13",
      name: "Nisha Patel",
      teluguName: "నిశా పటేల్",
      birthYear: "1968",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["15", "16"],
      partnerId: "8",
      biography: "Chief Investment Officer at Global Bank.",
      gender: "female"
    },
    "14": {
      id: "14",
      name: "Zara Patel",
      teluguName: "జారా పటేల్",
      birthYear: "1970",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["17"],
      partnerId: "9",
      biography: "Contemporary artist with exhibitions worldwide.",
      gender: "female"
    },

    // Fourth Generation
    "15": {
      id: "15",
      name: "Rohan Patel",
      teluguName: "రోహన్ పటేల్",
      birthYear: "1992",
      imageUrl: "",
      parentIds: ["8", "13"],
      childrenIds: ["22"],
      partnerId: "23",
      marriageYear: "2018",
      username: "rohan_p",
      biography: "Sustainable energy entrepreneur, Y Combinator alumni.",
      gender: "male"
    },
    "16": {
      id: "16",
      name: "Maya Patel",
      teluguName: "మాయా పటేల్",
      birthYear: "1995",
      imageUrl: "",
      parentIds: ["8", "13"],
      childrenIds: [],
      username: "maya_p",
      biography: "Professional tennis player, Olympic medalist.",
      gender: "female"
    },
    "17": {
      id: "17",
      name: "Dev Patel",
      teluguName: "దేవ్ పటేల్",
      birthYear: "1997",
      imageUrl: "",
      parentIds: ["9", "14"],
      childrenIds: [],
      username: "dev_p",
      biography: "Non-binary performance artist and LGBTQ+ activist.",
      gender: "other"
    },
    "18": {
      id: "18",
      name: "Aisha Kumar",
      teluguName: "ఐషా కుమార్",
      birthYear: "1990",
      imageUrl: "",
      parentIds: ["10", "20"],
      childrenIds: [],
      username: "aisha_k",
      biography: "Climate scientist at NASA.",
      gender: "female"
    },
    "19": {
      id: "19",
      name: "Rahul Kumar",
      teluguName: "రాహుల్ కుమార్",
      birthYear: "1993",
      imageUrl: "",
      parentIds: ["10", "20"],
      childrenIds: [],
      username: "rahul_k",
      biography: "Professional chef with two Michelin stars.",
      gender: "male"
    },
    "20": {
      id: "20",
      name: "Aditya Kumar",
      teluguName: "ఆదిత్య కుమార్",
      birthYear: "1963",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["18", "19"],
      partnerId: "10",
      biography: "Distinguished surgeon and medical researcher.",
      gender: "male"
    },
    "21": {
      id: "21",
      name: "Tara Reddy",
      teluguName: "తారా రెడ్డి",
      birthYear: "1995",
      imageUrl: "",
      parentIds: ["11"],
      childrenIds: [],
      username: "tara_r",
      biography: "Neuroscientist researching consciousness and AI.",
      gender: "female"
    },

    // Fifth Generation
    "22": {
      id: "22",
      name: "Aria Patel",
      teluguName: "ఆరియా పటేల్",
      birthYear: "2020",
      imageUrl: "",
      parentIds: ["15", "23"],
      childrenIds: [],
      username: "aria_p",
      biography: "The newest addition to the Patel family.",
      gender: "female"
    },
    "23": {
      id: "23",
      name: "Sofia Chen-Patel",
      teluguName: "సోఫియా చెన్-పటేల్",
      birthYear: "1993",
      imageUrl: "",
      parentIds: [],
      childrenIds: ["22"],
      partnerId: "15",
      biography: "Quantum computing engineer and tech evangelist.",
      gender: "female"
    }
  }
};