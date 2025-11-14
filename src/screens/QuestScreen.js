// // // // base UI skeleton
// // // // src/screens/QuestScreen.js
// // // import React from 'react';
// // // import { ScrollView, Text, StyleSheet } from 'react-native';
// // // import Screen from '../components/Screen';
// // // import { Colors } from '../constants/colors';

// // // export default function QuestScreen({ navigation }) {
// // //   return (
// // //     // 👇 Screen provides the sun-rays + back arrow automatically (upper-right)
// // //     <Screen showBack onBack={() => navigation.goBack()}>
// // //       <ScrollView contentContainerStyle={styles.content}>
// // //         <Text style={styles.title}>Today’s Quest 🎯</Text>
// // //         <Text style={styles.subtitle}>
// // //           Practice Faith, Love, Patience, Kindness.
// // //         </Text>
// // //         <Text style={{ color: Colors.text }}>
// // //           Daily 3-question flow placeholder…
// // //         </Text>
// // //       </ScrollView>
// // //     </Screen>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   content: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 20,
// // //   },
// // //   title: {
// // //     fontSize: 24,
// // //     fontWeight: '800',
// // //     color: Colors.button,
// // //   },
// // //   subtitle: {
// // //     fontSize: 16,
// // //     color: Colors.text,
// // //     marginBottom: 12,
// // //   },
// // // });

// // // adding quetion logic
// // // src/screens/QuestScreen.js
// // import React, { useEffect, useState } from 'react';
// // import {
// //   ScrollView,
// //   Text,
// //   StyleSheet,
// //   ActivityIndicator,
// //   View,
// //   TouchableOpacity,
// // } from 'react-native';

// // import Screen from '../components/Screen';
// // import { getTodaysVirtue } from '../logic/dailyVirtue';
// // import { Colors } from '../constants/colors';
// // import { getOrCreateTodaysQuest } from '../logic/dailyQuest';
// // import {
// //   isQuestCompletedToday,
// //   markQuestCompletedToday,
// // } from '../logic/dailyQuestState';

// // export default function QuestScreen({ navigation }) {
// //   const [loading, setLoading] = useState(true);
// //   const [completedInfo, setCompletedInfo] = useState(null);
// //   const [quest, setQuest] = useState(null);

// //   useEffect(() => {
// //     let isMounted = true;

// //     (async () => {
// //       try {
// //         // 1️⃣ Check if today's quest is already completed
// //         const done = await isQuestCompletedToday();
// //         if (!isMounted) return;

// //         if (done) {
// //           setCompletedInfo(done);
// //           setLoading(false);
// //           return;
// //         }

// //         // 2️⃣ Otherwise, load today's quest (virtue + questions)
// //         const result = await getOrCreateTodaysQuest();
// //         if (!isMounted) return;

// //         setQuest(result);
// //         setLoading(false);
// //       } catch (e) {
// //         console.warn('Error loading quest:', e);
// //         if (isMounted) {
// //           setLoading(false);
// //         }
// //       }
// //     })();

// //     return () => {
// //       isMounted = false;
// //     };
// //   }, []);

// //   const handleMarkCompleted = async () => {
// //     if (!quest?.virtue) return;
// //     const info = await markQuestCompletedToday(quest.virtue);
// //     setCompletedInfo(info);
// //   };

// //   // ---- Loading state ----
// //   if (loading) {
// //     return (
// //       <Screen showBack onBack={() => navigation.goBack()}>
// //         <View style={styles.loadingContainer}>
// //           <ActivityIndicator />
// //         </View>
// //       </Screen>
// //     );
// //   }

// //   // ---- Completed today: "come back tomorrow" mode ----
// //   if (completedInfo) {
// //     return (
// //       <Screen showBack onBack={() => navigation.goBack()}>
// //         <ScrollView contentContainerStyle={styles.content}>
// //           <Text style={styles.title}>Today’s Quest 🎯</Text>

// //           <Text style={styles.completedText}>
// //             Well done — go reflect Christ in your world today.
// //           </Text>

// //           {completedInfo.virtue ? (
// //             <Text style={styles.completedSub}>
// //               Today’s focus:{' '}
// //               <Text style={styles.virtueHighlight}>{completedInfo.virtue}</Text>
// //             </Text>
// //           ) : null}

// //           {/* Later: pull a virtue-specific verse here */}
// //           <Text style={styles.completedVerse}>
// //             “Let your light shine before others, so that they may see your good
// //             works and give glory to your Father who is in heaven.” (Matt 5:16)
// //           </Text>

// //           <View style={{ height: 16 }} />

// //           <TouchableOpacity
// //             style={styles.secondaryButton}
// //             onPress={() => navigation.navigate('Journal')}
// //           >
// //             <Text style={styles.secondaryButtonText}>Write in Journal</Text>
// //           </TouchableOpacity>

// //           <View style={{ height: 24 }} />

// //           <TouchableOpacity
// //             style={styles.primaryButton}
// //             onPress={() => navigation.navigate('HomeMain')}
// //           >
// //             <Text style={styles.primaryButtonText}>Back to Home</Text>
// //           </TouchableOpacity>
// //         </ScrollView>
// //       </Screen>
// //     );
// //   }

// //   // ---- Quest available for today: show virtue + questions preview (no scoring yet) ----
// //   const virtueLabel = quest?.virtue || getTodaysVirtue() || 'Today';

// //   return (
// //     <Screen showBack onBack={() => navigation.goBack()}>
// //       <ScrollView contentContainerStyle={styles.content}>
// //         <Text style={styles.title}>Today’s Quest 🎯</Text>
// //         <Text style={styles.subtitle}>
// //           Today’s focus:{' '}
// //           <Text style={styles.virtueHighlight}>{virtueLabel}</Text>
// //         </Text>

// //         <Text style={styles.intro}>
// //           Take a moment to read, reflect, and answer these questions slowly.
// //           There’s no score here — just space to grow in Christlike character.
// //         </Text>

// //         <View style={{ height: 16 }} />

// //         {quest?.questions?.map((q, index) => (
// //           <View key={q.id || index} style={styles.questionCard}>
// //             <Text style={styles.questionLabel}>
// //               {index === 0
// //                 ? 'Scenario'
// //                 : index === 1
// //                 ? 'Scripture'
// //                 : 'Bible Person'}
// //             </Text>
// //             <Text style={styles.questionPrompt}>{q.prompt}</Text>

// //             {/* For now, just preview options as text; later we’ll add full answer UI */}
// //             {q.options && q.options.length > 0 ? (
// //               <View style={styles.optionsList}>
// //                 {q.options.map((opt, i) => (
// //                   <Text key={`${q.id}-opt-${i}`} style={styles.optionText}>
// //                     • {opt}
// //                   </Text>
// //                 ))}
// //               </View>
// //             ) : null}

// //             {q.scriptureRef ? (
// //               <Text style={styles.scriptureRef}>{q.scriptureRef}</Text>
// //             ) : null}
// //           </View>
// //         ))}

// //         <View style={{ height: 20 }} />

// //         <Text style={styles.journalPrompt}>
// //           When you finish reflecting on these questions, take a moment to jot
// //           down how you can live out {virtueLabel.toLowerCase()} today in the
// //           Journal tab.
// //         </Text>

// //         <View style={{ height: 16 }} />

// //         {/* TEMP: manual "I’m done" button — later this will trigger after the answer flow */}
// //         <TouchableOpacity
// //           style={styles.primaryButton}
// //           onPress={handleMarkCompleted}
// //         >
// //           <Text style={styles.primaryButtonText}>
// //             I’ve Finished Today’s Quest
// //           </Text>
// //         </TouchableOpacity>
// //       </ScrollView>
// //     </Screen>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   content: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 20,
// //   },
// //   secondaryButton: {
// //     marginTop: 8,
// //     borderRadius: 999,
// //     paddingVertical: 10,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderWidth: 1,
// //     borderColor: Colors.button,
// //   },
// //   secondaryButtonText: {
// //     color: Colors.button,
// //     fontWeight: '700',
// //     fontSize: 15,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   title: {
// //     fontSize: 24,
// //     fontWeight: '800',
// //     color: Colors.button,
// //     marginBottom: 4,
// //   },
// //   subtitle: {
// //     fontSize: 16,
// //     color: Colors.text,
// //     marginBottom: 12,
// //   },
// //   virtueHighlight: {
// //     color: Colors.button,
// //     fontWeight: '800',
// //   },
// //   intro: {
// //     fontSize: 14,
// //     color: Colors.text,
// //     lineHeight: 20,
// //   },
// //   questionCard: {
// //     backgroundColor: '#111827',
// //     borderRadius: 12,
// //     padding: 14,
// //     marginBottom: 12,
// //     borderWidth: StyleSheet.hairlineWidth,
// //     borderColor: '#374151',
// //   },
// //   questionLabel: {
// //     fontSize: 13,
// //     fontWeight: '700',
// //     color: '#9CA3AF',
// //     marginBottom: 4,
// //     textTransform: 'uppercase',
// //     letterSpacing: 0.5,
// //   },
// //   questionPrompt: {
// //     fontSize: 15,
// //     color: '#E5E7EB',
// //     marginBottom: 6,
// //   },
// //   optionsList: {
// //     marginTop: 4,
// //   },
// //   optionText: {
// //     fontSize: 14,
// //     color: '#D1D5DB',
// //     marginTop: 2,
// //   },
// //   scriptureRef: {
// //     fontSize: 12,
// //     color: '#9CA3AF',
// //     marginTop: 6,
// //     fontStyle: 'italic',
// //   },
// //   journalPrompt: {
// //     fontSize: 14,
// //     color: Colors.text,
// //     lineHeight: 20,
// //   },
// //   primaryButton: {
// //     marginTop: 8,
// //     backgroundColor: Colors.button,
// //     borderRadius: 999,
// //     paddingVertical: 12,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   primaryButtonText: {
// //     color: '#fff',
// //     fontWeight: '700',
// //     fontSize: 16,
// //   },
// //   completedText: {
// //     fontSize: 16,
// //     color: Colors.text,
// //     marginTop: 8,
// //     marginBottom: 8,
// //   },
// //   completedSub: {
// //     fontSize: 14,
// //     color: Colors.text,
// //     marginBottom: 12,
// //   },
// //   completedVerse: {
// //     fontSize: 14,
// //     color: Colors.text,
// //     fontStyle: 'italic',
// //     lineHeight: 20,
// //   },
// // });

// // adding quest screen logic
// // src/screens/QuestScreen.js
// import React, { useEffect, useState } from 'react';
// import {
//   ScrollView,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   View,
//   TouchableOpacity,
// } from 'react-native';

// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';
// import { getOrCreateTodaysQuest } from '../logic/dailyQuest';
// import {
//   isQuestCompletedToday,
//   markQuestCompletedToday,
// } from '../logic/dailyQuestState';
// import { getTodaysVirtue } from '../logic/dailyVirtue';

// export default function QuestScreen({ navigation }) {
//   const [loading, setLoading] = useState(true);
//   const [completedInfo, setCompletedInfo] = useState(null);
//   const [quest, setQuest] = useState(null);

//   // Local Q&A state
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [disabledOptions, setDisabledOptions] = useState({}); // { [questionId]: number[] }
//   const [feedback, setFeedback] = useState(null); // { type: 'correct' | 'incorrect', message }
//   const [hasAnsweredCurrentCorrectly, setHasAnsweredCurrentCorrectly] =
//     useState(false);
//   const [finishing, setFinishing] = useState(false);

//   useEffect(() => {
//     let isMounted = true;

//     (async () => {
//       try {
//         const done = await isQuestCompletedToday();
//         if (!isMounted) return;

//         if (done) {
//           setCompletedInfo(done);
//           setLoading(false);
//           return;
//         }

//         const result = await getOrCreateTodaysQuest();
//         if (!isMounted) return;

//         setQuest(result || null);
//         setCurrentIndex(0);
//         setSelectedIndex(null);
//         setDisabledOptions({});
//         setFeedback(null);
//         setHasAnsweredCurrentCorrectly(false);
//         setLoading(false);
//       } catch (e) {
//         console.warn('Error loading quest:', e);
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     })();

//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   const handleSelectOption = (index) => {
//     if (!quest) return;
//     if (hasAnsweredCurrentCorrectly) return;

//     const q = quest.questions[currentIndex];
//     const qId = q.id;
//     const disabledForQ = disabledOptions[qId] || [];

//     // Don’t allow re-selecting disabled options
//     if (disabledForQ.includes(index)) return;

//     setSelectedIndex(index);
//     setFeedback(null);
//   };

//   const handleSubmit = () => {
//     if (!quest) return;

//     const questions = quest.questions || [];
//     if (!questions.length) return;

//     const q = questions[currentIndex];
//     if (selectedIndex == null) return;

//     const correct = selectedIndex === q.answerIndex;

//     if (correct) {
//       setFeedback({
//         type: 'correct',
//         message:
//           'That lines up with the heart of this passage. Give thanks to the Lord for His wisdom.',
//       });
//       setHasAnsweredCurrentCorrectly(true);
//     } else {
//       const qId = q.id;
//       setDisabledOptions((prev) => {
//         const existing = prev[qId] || [];
//         if (existing.includes(selectedIndex)) return prev;
//         return { ...prev, [qId]: [...existing, selectedIndex] };
//       });

//       setFeedback({
//         type: 'incorrect',
//         message:
//           'Not quite. Think again about how Jesus loves, serves, and speaks. Try another option.',
//       });
//       setSelectedIndex(null);
//     }
//   };

//   const goToNextQuestion = () => {
//     setCurrentIndex((prev) => prev + 1);
//     setSelectedIndex(null);
//     setFeedback(null);
//     setHasAnsweredCurrentCorrectly(false);
//   };

//   const handleFinishQuest = async () => {
//     if (!quest?.virtue) return;
//     setFinishing(true);
//     try {
//       const info = await markQuestCompletedToday(quest.virtue);
//       setCompletedInfo(info);
//     } catch (e) {
//       console.warn('Error marking quest completed:', e);
//     } finally {
//       setFinishing(false);
//     }
//   };

//   // ---- Loading state ----
//   if (loading) {
//     return (
//       <Screen showBack onBack={() => navigation.goBack()}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator />
//         </View>
//       </Screen>
//     );
//   }

//   // ---- Completed today: "come back tomorrow" mode ----
//   if (completedInfo) {
//     return (
//       <Screen showBack onBack={() => navigation.goBack()}>
//         <ScrollView contentContainerStyle={styles.content}>
//           <Text style={styles.title}>Today’s Quest 🎯</Text>

//           <Text style={styles.completedText}>
//             Well done — go reflect Christ in your world today.
//           </Text>

//           {completedInfo.virtue ? (
//             <Text style={styles.completedSub}>
//               Today’s focus:{' '}
//               <Text style={styles.virtueHighlight}>{completedInfo.virtue}</Text>
//             </Text>
//           ) : null}

//           {/* Later: pull a virtue-specific verse here */}
//           <Text style={styles.completedVerse}>
//             “Let your light shine before others, so that they may see your good
//             works and give glory to your Father who is in heaven.” (Matt 5:16)
//           </Text>

//           <View style={{ height: 24 }} />

//           <TouchableOpacity
//             style={styles.secondaryButton}
//             onPress={() => navigation.navigate('Journal')}
//           >
//             <Text style={styles.secondaryButtonText}>Write in Journal</Text>
//           </TouchableOpacity>

//           <View style={{ height: 12 }} />

//           <TouchableOpacity
//             style={styles.primaryButton}
//             onPress={() => navigation.navigate('HomeMain')}
//           >
//             <Text style={styles.primaryButtonText}>Back to Home</Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </Screen>
//     );
//   }

//   // ---- Quest available for today: interactive Q&A ----
//   if (!quest || !quest.questions || quest.questions.length === 0) {
//     return (
//       <Screen showBack onBack={() => navigation.goBack()}>
//         <ScrollView contentContainerStyle={styles.content}>
//           <Text style={styles.title}>Today’s Quest 🎯</Text>
//           <Text style={styles.subtitle}>
//             Today’s focus:{' '}
//             <Text style={styles.virtueHighlight}>
//               {getTodaysVirtue() || 'Today'}
//             </Text>
//           </Text>
//           <Text style={styles.intro}>
//             Today’s quest isn’t quite ready yet. Check back tomorrow for a new
//             set of questions.
//           </Text>
//         </ScrollView>
//       </Screen>
//     );
//   }

//   const questions = quest.questions;
//   const currentQuestion = questions[currentIndex];
//   const totalQuestions = questions.length;
//   const isLastQuestion = currentIndex === totalQuestions - 1;

//   const qId = currentQuestion.id;
//   const disabledForQ = disabledOptions[qId] || [];

//   const virtueLabel = quest.virtue || getTodaysVirtue() || 'Today';

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView contentContainerStyle={styles.content}>
//         <Text style={styles.title}>Today’s Quest 🎯</Text>
//         <Text style={styles.subtitle}>
//           Today’s focus:{' '}
//           <Text style={styles.virtueHighlight}>{virtueLabel}</Text>
//         </Text>

//         <Text style={styles.intro}>
//           Take a moment to read, reflect, and answer these questions slowly.
//           There’s no score here — just space to grow in Christlike character.
//         </Text>

//         <View style={{ height: 16 }} />

//         <Text style={styles.progressText}>
//           Question {currentIndex + 1} of {totalQuestions}
//         </Text>

//         <View style={styles.questionCard}>
//           <Text style={styles.questionLabel}>
//             {currentQuestion.type === 'scenario'
//               ? 'Scenario'
//               : currentQuestion.type === 'verse'
//               ? 'Scripture'
//               : 'Bible Person'}
//           </Text>
//           <Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>

//           {currentQuestion.options && currentQuestion.options.length > 0 ? (
//             <View style={styles.optionsList}>
//               {currentQuestion.options.map((opt, i) => {
//                 const isDisabled = disabledForQ.includes(i);
//                 const isSelected = selectedIndex === i;
//                 const isCorrectAnswer =
//                   hasAnsweredCurrentCorrectly &&
//                   i === currentQuestion.answerIndex;

//                 return (
//                   <TouchableOpacity
//                     key={`${currentQuestion.id}-opt-${i}`}
//                     onPress={() => handleSelectOption(i)}
//                     activeOpacity={0.9}
//                     disabled={hasAnsweredCurrentCorrectly || isDisabled}
//                     style={[
//                       styles.optionButton,
//                       isSelected && styles.optionSelected,
//                       isDisabled && styles.optionDisabled,
//                       isCorrectAnswer && styles.optionCorrect,
//                     ]}
//                   >
//                     <Text style={styles.optionText}>{opt}</Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           ) : null}

//           {currentQuestion.scriptureRef ? (
//             <Text style={styles.scriptureRef}>
//               {currentQuestion.scriptureRef}
//             </Text>
//           ) : null}

//           {feedback ? (
//             <Text
//               style={[
//                 styles.feedbackText,
//                 feedback.type === 'correct'
//                   ? styles.feedbackCorrect
//                   : styles.feedbackIncorrect,
//               ]}
//             >
//               {feedback.message}
//             </Text>
//           ) : null}

//           <View style={{ height: 12 }} />

//           {!hasAnsweredCurrentCorrectly ? (
//             <TouchableOpacity
//               style={[
//                 styles.primaryButton,
//                 selectedIndex == null && { opacity: 0.6 },
//               ]}
//               onPress={handleSubmit}
//               disabled={selectedIndex == null}
//             >
//               <Text style={styles.primaryButtonText}>Submit Answer</Text>
//             </TouchableOpacity>
//           ) : (
//             <>
//               {!isLastQuestion ? (
//                 <TouchableOpacity
//                   style={styles.primaryButton}
//                   onPress={goToNextQuestion}
//                 >
//                   <Text style={styles.primaryButtonText}>Next Question</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={[styles.primaryButton, finishing && { opacity: 0.6 }]}
//                   onPress={handleFinishQuest}
//                   disabled={finishing}
//                 >
//                   {finishing ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text style={styles.primaryButtonText}>
//                       Finish Today’s Quest
//                     </Text>
//                   )}
//                 </TouchableOpacity>
//               )}
//             </>
//           )}
//         </View>

//         <View style={{ height: 20 }} />

//         <Text style={styles.journalPrompt}>
//           When you finish today’s quest, take a moment to jot down how you can
//           live out {virtueLabel.toLowerCase()} today in the Journal tab.
//         </Text>
//       </ScrollView>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: Colors.button,
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: Colors.text,
//     marginBottom: 12,
//   },
//   virtueHighlight: {
//     color: Colors.button,
//     fontWeight: '800',
//   },
//   intro: {
//     fontSize: 14,
//     color: Colors.text,
//     lineHeight: 20,
//   },
//   progressText: {
//     fontSize: 13,
//     color: Colors.text,
//     marginBottom: 6,
//   },
//   questionCard: {
//     backgroundColor: '#111827',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: '#374151',
//   },
//   questionLabel: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#9CA3AF',
//     marginBottom: 4,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//   },
//   questionPrompt: {
//     fontSize: 15,
//     color: '#E5E7EB',
//     marginBottom: 10,
//   },
//   optionsList: {
//     marginTop: 4,
//   },
//   optionButton: {
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginTop: 6,
//     borderWidth: 1,
//     borderColor: '#4B5563',
//     backgroundColor: '#111827',
//   },
//   optionText: {
//     fontSize: 14,
//     color: '#E5E7EB',
//   },
//   optionSelected: {
//     borderColor: Colors.button,
//     backgroundColor: '#1F2937',
//   },
//   optionDisabled: {
//     opacity: 0.4,
//   },
//   optionCorrect: {
//     borderColor: '#10B981',
//     backgroundColor: '#064E3B',
//   },
//   scriptureRef: {
//     fontSize: 12,
//     color: '#9CA3AF',
//     marginTop: 8,
//     fontStyle: 'italic',
//   },
//   feedbackText: {
//     fontSize: 13,
//     marginTop: 10,
//   },
//   feedbackCorrect: {
//     color: '#6EE7B7',
//   },
//   feedbackIncorrect: {
//     color: '#FCA5A5',
//   },
//   journalPrompt: {
//     fontSize: 14,
//     color: Colors.text,
//     lineHeight: 20,
//   },
//   primaryButton: {
//     marginTop: 4,
//     backgroundColor: Colors.button,
//     borderRadius: 999,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   primaryButtonText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 16,
//   },
//   secondaryButton: {
//     marginTop: 8,
//     borderRadius: 999,
//     paddingVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: Colors.button,
//   },
//   secondaryButtonText: {
//     color: Colors.button,
//     fontWeight: '700',
//     fontSize: 15,
//   },
//   completedText: {
//     fontSize: 16,
//     color: Colors.text,
//     marginTop: 8,
//     marginBottom: 8,
//   },
//   completedSub: {
//     fontSize: 14,
//     color: Colors.text,
//     marginBottom: 12,
//   },
//   completedVerse: {
//     fontSize: 14,
//     color: Colors.text,
//     fontStyle: 'italic',
//     lineHeight: 20,
//   },
// });

//updating no question logic
// src/screens/QuestScreen.js
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  TouchableOpacity,
} from 'react-native';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';
import { getOrCreateTodaysQuest } from '../logic/dailyQuest';
import {
  isQuestCompletedToday,
  markQuestCompletedToday,
} from '../logic/dailyQuestState';
import { getTodaysVirtue } from '../logic/dailyVirtue';

// Simple virtue → verse mapping for completion + fallback
const VIRTUE_VERSES = {
  Faith: {
    ref: 'Hebrews 11:1',
    text: 'Now faith is the assurance of things hoped for, the conviction of things not seen.',
  },
  Love: {
    ref: 'Philippians 1:9',
    text: 'And it is my prayer that your love may abound more and more, with knowledge and all discernment.',
  },
  Patience: {
    ref: 'James 1:4',
    text: 'And let steadfastness have its full effect, that you may be perfect and complete, lacking in nothing.',
  },
  Kindness: {
    ref: 'Ephesians 4:32',
    text: 'Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.',
  },
};

function getVirtueVerse(virtue) {
  return VIRTUE_VERSES[virtue] || null;
}

export default function QuestScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [completedInfo, setCompletedInfo] = useState(null);
  const [quest, setQuest] = useState(null);

  // Local Q&A state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [disabledOptions, setDisabledOptions] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [hasAnsweredCurrentCorrectly, setHasAnsweredCurrentCorrectly] =
    useState(false);
  const [finishing, setFinishing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const done = await isQuestCompletedToday();
        if (!isMounted) return;

        if (done) {
          setCompletedInfo(done);
          setLoading(false);
          return;
        }

        const result = await getOrCreateTodaysQuest();
        if (!isMounted) return;

        setQuest(result || null);
        setCurrentIndex(0);
        setSelectedIndex(null);
        setDisabledOptions({});
        setFeedback(null);
        setHasAnsweredCurrentCorrectly(false);
        setLoading(false);
      } catch (e) {
        console.warn('Error loading quest:', e);
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectOption = (index) => {
    if (!quest) return;
    if (hasAnsweredCurrentCorrectly) return;

    const q = quest.questions[currentIndex];
    const qId = q.id;
    const disabledForQ = disabledOptions[qId] || [];

    if (disabledForQ.includes(index)) return;

    setSelectedIndex(index);
    setFeedback(null);
  };

  const handleSubmit = () => {
    if (!quest) return;

    const questions = quest.questions || [];
    if (!questions.length) return;

    const q = questions[currentIndex];
    if (selectedIndex == null) return;

    const correct = selectedIndex === q.answerIndex;

    if (correct) {
      setFeedback({
        type: 'correct',
        message:
          'That lines up with the heart of this passage. Give thanks to the Lord for His wisdom.',
      });
      setHasAnsweredCurrentCorrectly(true);
    } else {
      const qId = q.id;
      setDisabledOptions((prev) => {
        const existing = prev[qId] || [];
        if (existing.includes(selectedIndex)) return prev;
        return { ...prev, [qId]: [...existing, selectedIndex] };
      });

      setFeedback({
        type: 'incorrect',
        message:
          'Not quite. Think again about how Jesus loves, serves, and speaks. Try another option.',
      });
      setSelectedIndex(null);
    }
  };

  const goToNextQuestion = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedIndex(null);
    setFeedback(null);
    setHasAnsweredCurrentCorrectly(false);
  };

  const handleFinishQuest = async () => {
    if (!quest?.virtue) return;
    setFinishing(true);
    try {
      const info = await markQuestCompletedToday(quest.virtue);
      setCompletedInfo(info);
    } catch (e) {
      console.warn('Error marking quest completed:', e);
    } finally {
      setFinishing(false);
    }
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <Screen showBack onBack={() => navigation.goBack()}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  // Helper for virtue + verse
  const activeVirtue =
    completedInfo?.virtue || quest?.virtue || getTodaysVirtue() || 'Today';
  const virtueVerse = getVirtueVerse(activeVirtue);

  // ---- Completed today: "come back tomorrow" mode ----
  if (completedInfo) {
    return (
      <Screen showBack onBack={() => navigation.goBack()}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Today’s Quest 🎯</Text>

          <Text style={styles.completedText}>
            Well done — go reflect Christ in your world today.
          </Text>

          <Text style={styles.completedSub}>
            Today’s focus:{' '}
            <Text style={styles.virtueHighlight}>{activeVirtue}</Text>
          </Text>

          {virtueVerse ? (
            <Text style={styles.completedVerse}>
              “{virtueVerse.text}” ({virtueVerse.ref})
            </Text>
          ) : (
            <Text style={styles.completedVerse}>
              “Let your light shine before others, so that they may see your
              good works and give glory to your Father who is in heaven.”
              (Matthew 5:16)
            </Text>
          )}

          <View style={{ height: 24 }} />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Journal')}
          >
            <Text style={styles.secondaryButtonText}>Write in Journal</Text>
          </TouchableOpacity>

          <View style={{ height: 12 }} />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('HomeMain')}
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </Screen>
    );
  }

  // ---- Quest available for today, but no questions in DB ----
  if (!quest || !quest.questions || quest.questions.length === 0) {
    return (
      <Screen showBack onBack={() => navigation.goBack()}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Today’s Quest 🎯</Text>
          <Text style={styles.subtitle}>
            Today’s focus:{' '}
            <Text style={styles.virtueHighlight}>{activeVirtue}</Text>
          </Text>

          <Text style={styles.intro}>
            Today’s questions aren’t available yet. For now, take this as a
            moment to pause, meditate on the Word, and go live out Christ’s
            character in the world.
          </Text>

          {virtueVerse ? (
            <Text style={[styles.completedVerse, { marginTop: 16 }]}>
              “{virtueVerse.text}” ({virtueVerse.ref})
            </Text>
          ) : null}

          <View style={{ height: 24 }} />

          <Text style={styles.completedText}>
            Now go be the salt of the earth and reflect Christ to those around
            you today.
          </Text>

          <View style={{ height: 24 }} />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Journal')}
          >
            <Text style={styles.secondaryButtonText}>Write in Journal</Text>
          </TouchableOpacity>

          <View style={{ height: 12 }} />

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('HomeMain')}
          >
            <Text style={styles.primaryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </Screen>
    );
  }

  // ---- Quest available with questions: interactive Q&A ----
  const questions = quest.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  const qId = currentQuestion.id;
  const disabledForQ = disabledOptions[qId] || [];

  const virtueLabel = quest.virtue || getTodaysVirtue() || 'Today';

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Today’s Quest 🎯</Text>
        <Text style={styles.subtitle}>
          Today’s focus:{' '}
          <Text style={styles.virtueHighlight}>{virtueLabel}</Text>
        </Text>

        <Text style={styles.intro}>
          Take a moment to read, reflect, and answer these questions slowly.
          There’s no score here — just space to grow in Christlike character.
        </Text>

        <View style={{ height: 16 }} />

        <Text style={styles.progressText}>
          Question {currentIndex + 1} of {totalQuestions}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>
            {currentQuestion.type === 'scenario'
              ? 'Scenario'
              : currentQuestion.type === 'verse'
              ? 'Scripture'
              : 'Bible Person'}
          </Text>
          <Text style={styles.questionPrompt}>{currentQuestion.prompt}</Text>

          {currentQuestion.options && currentQuestion.options.length > 0 ? (
            <View style={styles.optionsList}>
              {currentQuestion.options.map((opt, i) => {
                const isDisabled = disabledForQ.includes(i);
                const isSelected = selectedIndex === i;
                const isCorrectAnswer =
                  hasAnsweredCurrentCorrectly &&
                  i === currentQuestion.answerIndex;

                return (
                  <TouchableOpacity
                    key={`${currentQuestion.id}-opt-${i}`}
                    onPress={() => handleSelectOption(i)}
                    activeOpacity={0.9}
                    disabled={hasAnsweredCurrentCorrectly || isDisabled}
                    style={[
                      styles.optionButton,
                      isSelected && styles.optionSelected,
                      isDisabled && styles.optionDisabled,
                      isCorrectAnswer && styles.optionCorrect,
                    ]}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}

          {currentQuestion.scriptureRef ? (
            <Text style={styles.scriptureRef}>
              {currentQuestion.scriptureRef}
            </Text>
          ) : null}

          {feedback ? (
            <Text
              style={[
                styles.feedbackText,
                feedback.type === 'correct'
                  ? styles.feedbackCorrect
                  : styles.feedbackIncorrect,
              ]}
            >
              {feedback.message}
            </Text>
          ) : null}

          <View style={{ height: 12 }} />

          {!hasAnsweredCurrentCorrectly ? (
            <TouchableOpacity
              style={[
                styles.primaryButton,
                selectedIndex == null && { opacity: 0.6 },
              ]}
              onPress={handleSubmit}
              disabled={selectedIndex == null}
            >
              <Text style={styles.primaryButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          ) : (
            <>
              {!isLastQuestion ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={goToNextQuestion}
                >
                  <Text style={styles.primaryButtonText}>Next Question</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.primaryButton, finishing && { opacity: 0.6 }]}
                  onPress={handleFinishQuest}
                  disabled={finishing}
                >
                  {finishing ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>
                      Finish Today’s Quest
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={{ height: 20 }} />

        <Text style={styles.journalPrompt}>
          When you finish today’s quest, take a moment to jot down how you can
          live out {virtueLabel.toLowerCase()} today in the Journal tab.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.button,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 12,
  },
  virtueHighlight: {
    color: Colors.button,
    fontWeight: '800',
  },
  intro: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  progressText: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 6,
  },
  questionCard: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#374151',
  },
  questionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  questionPrompt: {
    fontSize: 15,
    color: '#E5E7EB',
    marginBottom: 10,
  },
  optionsList: {
    marginTop: 4,
  },
  optionButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#4B5563',
    backgroundColor: '#111827',
  },
  optionText: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  optionSelected: {
    borderColor: Colors.button,
    backgroundColor: '#1F2937',
  },
  optionDisabled: {
    opacity: 0.4,
  },
  optionCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  scriptureRef: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontStyle: 'italic',
  },
  feedbackText: {
    fontSize: 13,
    marginTop: 10,
  },
  feedbackCorrect: {
    color: '#6EE7B7',
  },
  feedbackIncorrect: {
    color: '#FCA5A5',
  },
  journalPrompt: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 4,
    backgroundColor: Colors.button,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.button,
  },
  secondaryButtonText: {
    color: Colors.button,
    fontWeight: '700',
    fontSize: 15,
  },
  completedText: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  completedSub: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 12,
  },
  completedVerse: {
    fontSize: 14,
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});
