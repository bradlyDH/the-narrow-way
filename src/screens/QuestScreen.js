// // // src/screens/QuestScreen.js
// // import React, { useEffect, useState } from 'react';
// // import {
// //   ScrollView,
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ActivityIndicator,
// // } from 'react-native';

// // import Screen from '../components/Screen';
// // import { Colors } from '../constants/colors';

// // import {
// //   getOrCreateTodaysQuest,
// //   isQuestCompletedToday,
// //   markQuestCompletedToday,
// // } from '../logic/dailyQuest';
// // import { getTodaysVirtue } from '../logic/dailyVirtue';

// // function QuestionOption({
// //   label,
// //   index,
// //   selected,
// //   disabled,
// //   isCorrect,
// //   showResult,
// //   onPress,
// // }) {
// //   let bg = '#1f2937';
// //   let border = '#4b5563';
// //   let textColor = '#f9fafb';

// //   if (disabled && !showResult) {
// //     bg = '#111827';
// //     border = '#374151';
// //     textColor = '#6b7280';
// //   }

// //   if (showResult) {
// //     if (isCorrect) {
// //       bg = '#14532d';
// //       border = '#22c55e';
// //     } else if (selected) {
// //       bg = '#7f1d1d';
// //       border = '#f97373';
// //     }
// //   } else if (selected) {
// //     bg = '#111827';
// //     border = Colors.button;
// //   }

// //   return (
// //     <TouchableOpacity
// //       onPress={() => !disabled && onPress(index)}
// //       activeOpacity={0.85}
// //       disabled={disabled}
// //       style={[styles.option, { backgroundColor: bg, borderColor: border }]}
// //     >
// //       <Text style={[styles.optionText, { color: textColor }]}>{label}</Text>
// //     </TouchableOpacity>
// //   );
// // }

// // // 🧽 clean up \n and \" from prompts coming from SQL
// // function formatPrompt(raw) {
// //   if (!raw) return '';
// //   return raw.replace(/\\n/g, '\n').replace(/\\"/g, '"');
// // }

// // export default function QuestScreen({ navigation }) {
// //   const [loading, setLoading] = useState(true);
// //   const [questCompleted, setQuestCompleted] = useState(false);
// //   const [quest, setQuest] = useState(null);
// //   const [virtueInfo, setVirtueInfo] = useState(null);
// //   const [displayVirtueName, setDisplayVirtueName] = useState('Today');

// //   const [index, setIndex] = useState(0);
// //   const [selectedIndex, setSelectedIndex] = useState(null);
// //   const [lockedWrong, setLockedWrong] = useState([]);
// //   const [mode, setMode] = useState('question'); // 'question' | 'review'
// //   const [feedback, setFeedback] = useState('');

// //   useEffect(() => {
// //     let mounted = true;

// //     (async () => {
// //       try {
// //         // We always load today's quest so we can know its virtue,
// //         // even if it's already completed.
// //         const [virtueData, questData, completedFlag] = await Promise.all([
// //           getTodaysVirtue(),
// //           getOrCreateTodaysQuest(),
// //           isQuestCompletedToday(),
// //         ]);

// //         if (!mounted) return;

// //         setVirtueInfo(virtueData || null);
// //         setQuest(questData || null);

// //         const virtNameFromVirtue =
// //           virtueData &&
// //           (virtueData.virtue || virtueData.name || virtueData.label);

// //         const virtNameFromQuest =
// //           questData && (questData.virtue || questData.virtueName);

// //         const finalVirtueName =
// //           virtNameFromVirtue || virtNameFromQuest || 'Today';

// //         setDisplayVirtueName(finalVirtueName);

// //         const isCompleted =
// //           !!completedFlag || (questData && questData.completed);

// //         setQuestCompleted(isCompleted);

// //         if (isCompleted) {
// //           // We’re done for today; just show the completed view
// //           setLoading(false);
// //           return;
// //         }

// //         // Not completed → prepare for question flow
// //         setIndex(0);
// //         setSelectedIndex(null);
// //         setLockedWrong([]);
// //         setMode('question');
// //         setFeedback('');
// //         setLoading(false);
// //       } catch (e) {
// //         console.warn('Quest load error:', e);
// //         if (mounted) setLoading(false);
// //       }
// //     })();

// //     return () => {
// //       mounted = false;
// //     };
// //   }, []);

// //   const currentQuestion =
// //     quest && quest.questions && quest.questions[index]
// //       ? quest.questions[index]
// //       : null;

// //   const isLastQuestion =
// //     quest && quest.questions ? index === quest.questions.length - 1 : false;

// //   const handleSelectOption = (i) => {
// //     if (mode !== 'question') return;
// //     if (lockedWrong.includes(i)) return;
// //     setSelectedIndex(i);
// //     setFeedback('');
// //   };

// //   const handleSubmit = () => {
// //     if (!currentQuestion || selectedIndex == null) return;

// //     const correctIndex = currentQuestion.answerIndex;

// //     if (selectedIndex === correctIndex) {
// //       let msg = '';

// //       if (currentQuestion.type === 'scenario') {
// //         msg = `That’s a Christlike response of ${displayVirtueName.toLowerCase()}.`;
// //       } else if (currentQuestion.type === 'verse') {
// //         msg = 'Well done — hiding God’s Word in your heart matters.';
// //       } else if (currentQuestion.type === 'general') {
// //         msg =
// //           'Great! Growing in knowledge helps you know God and His Word better.';
// //       } else {
// //         msg = 'Good job!';
// //       }

// //       setFeedback(msg);
// //       setMode('review');
// //       return;
// //     }

// //     // wrong answer
// //     const newLocked = Array.from(new Set([...lockedWrong, selectedIndex]));
// //     setLockedWrong(newLocked);
// //     setSelectedIndex(null);

// //     const totalOptions = (currentQuestion.options || []).length;
// //     if (newLocked.length >= totalOptions - 1) {
// //       // only one option left – reveal the correct one
// //       setSelectedIndex(currentQuestion.answerIndex);
// //       setMode('review');
// //       setFeedback(
// //         'Here is the correct answer — let this truth shape your heart today.'
// //       );
// //     } else {
// //       setFeedback('Not quite. Try another option.');
// //     }
// //   };

// //   const handleNext = async () => {
// //     if (!quest || !quest.questions) return;

// //     if (isLastQuestion) {
// //       await markQuestCompletedToday();
// //       setQuestCompleted(true);
// //       setFeedback('');
// //       setMode('question');
// //       return;
// //     }

// //     const nextIndex = index + 1;
// //     setIndex(nextIndex);
// //     setSelectedIndex(null);
// //     setLockedWrong([]);
// //     setFeedback('');
// //     setMode('question');
// //   };

// //   const virtueVerseRef = virtueInfo?.verse_ref || null;
// //   const virtueVerseText = virtueInfo?.verse_text || null;

// //   // ------------- RENDER -------------

// //   if (loading) {
// //     return (
// //       <Screen showBack onBack={() => navigation.goBack()}>
// //         <View style={styles.centerWrap}>
// //           <ActivityIndicator size="large" color={Colors.button} />
// //           <Text style={[styles.subText, { marginTop: 12 }]}>
// //             Preparing today’s quest…
// //           </Text>
// //         </View>
// //       </Screen>
// //     );
// //   }

// //   // Completed view or no questions
// //   if (
// //     questCompleted ||
// //     !quest ||
// //     !quest.questions ||
// //     quest.questions.length === 0
// //   ) {
// //     return (
// //       <Screen showBack onBack={() => navigation.goBack()}>
// //         <ScrollView
// //           contentContainerStyle={styles.content}
// //           showsVerticalScrollIndicator={false}
// //         >
// //           <Text style={styles.title}>Today’s Quest ✅</Text>

// //           <Text style={styles.completeLine}>
// //             Now go be the salt of the earth and reflect Christ to those around
// //             you, and we’ll have another quest ready tomorrow! 🎚️
// //           </Text>

// //           <View style={{ height: 12 }} />

// //           <Text style={styles.focusLabel}>Today’s Focus</Text>
// //           <Text style={styles.focusVirtue}>{displayVirtueName}</Text>

// //           {virtueVerseRef || virtueVerseText ? (
// //             <View style={styles.verseBox}>
// //               {virtueVerseRef ? (
// //                 <Text style={styles.verseRef}>{virtueVerseRef}</Text>
// //               ) : null}
// //               {virtueVerseText ? (
// //                 <Text style={styles.verseText}>{virtueVerseText}</Text>
// //               ) : null}
// //             </View>
// //           ) : null}

// //           <TouchableOpacity
// //             style={styles.homeBtn}
// //             activeOpacity={0.9}
// //             onPress={() =>
// //               navigation.navigate('MainTabs', {
// //                 screen: 'Home',
// //               })
// //             }
// //           >
// //             <Text style={styles.homeBtnText}>Back to Home</Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             style={styles.journalBtn}
// //             activeOpacity={0.9}
// //             onPress={() =>
// //               navigation.navigate('MainTabs', {
// //                 screen: 'Journal',
// //                 params: { presetVirtue: displayVirtueName },
// //               })
// //             }
// //           >
// //             <Text style={styles.journalBtnText}>
// //               Journal About Today’s Focus
// //             </Text>
// //           </TouchableOpacity>
// //         </ScrollView>
// //       </Screen>
// //     );
// //   }

// //   // Active quest view
// //   const total = quest.questions.length;
// //   const qNum = index + 1;

// //   const promptText = formatPrompt(currentQuestion.prompt);

// //   return (
// //     <Screen showBack onBack={() => navigation.goBack()}>
// //       <ScrollView
// //         contentContainerStyle={styles.content}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         <Text style={styles.title}>Today’s Quest 🎯</Text>
// //         <Text style={styles.subText}>Growing in obedience to Christ.</Text>

// //         <View style={styles.focusRow}>
// //           <Text style={styles.focusLabel}>Today’s Focus:</Text>
// //           <Text style={styles.focusVirtue}>{displayVirtueName}</Text>
// //         </View>

// //         <Text style={styles.progressText}>
// //           Question {qNum} of {total}
// //         </Text>

// //         <View style={styles.questionBox}>
// //           <Text style={styles.prompt}>{promptText}</Text>

// //           {currentQuestion.scriptureRef ? (
// //             <Text style={styles.scriptureRef}>
// //               {currentQuestion.scriptureRef}
// //             </Text>
// //           ) : null}

// //           <View style={{ height: 10 }} />

// //           {(currentQuestion.options || []).map((opt, i) => (
// //             <QuestionOption
// //               key={i.toString()}
// //               label={opt}
// //               index={i}
// //               selected={selectedIndex === i}
// //               disabled={lockedWrong.includes(i)}
// //               isCorrect={i === currentQuestion.answerIndex}
// //               showResult={mode === 'review'}
// //               onPress={handleSelectOption}
// //             />
// //           ))}

// //           {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

// //           {mode === 'question' ? (
// //             <TouchableOpacity
// //               style={[
// //                 styles.submitBtn,
// //                 selectedIndex == null && { opacity: 0.6 },
// //               ]}
// //               disabled={selectedIndex == null}
// //               activeOpacity={0.9}
// //               onPress={handleSubmit}
// //             >
// //               <Text style={styles.submitText}>Submit</Text>
// //             </TouchableOpacity>
// //           ) : (
// //             <TouchableOpacity
// //               style={styles.submitBtn}
// //               activeOpacity={0.9}
// //               onPress={handleNext}
// //             >
// //               <Text style={styles.submitText}>
// //                 {isLastQuestion ? 'Finish Quest' : 'Next Question'}
// //               </Text>
// //             </TouchableOpacity>
// //           )}
// //         </View>
// //       </ScrollView>
// //     </Screen>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   content: {
// //     paddingHorizontal: 16,
// //     paddingVertical: 20,
// //   },
// //   centerWrap: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingHorizontal: 16,
// //   },
// //   title: {
// //     fontSize: 26,
// //     fontWeight: '800',
// //     color: Colors.button,
// //     marginBottom: 4,
// //   },
// //   subText: {
// //     fontSize: 15,
// //     color: Colors.text,
// //     marginBottom: 16,
// //   },
// //   focusRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 6,
// //     gap: 6,
// //   },
// //   focusLabel: {
// //     fontSize: 14,
// //     color: Colors.text,
// //     fontWeight: '600',
// //   },
// //   focusVirtue: {
// //     fontSize: 18,
// //     fontWeight: '800',
// //     color: '#fef9c3',
// //   },
// //   progressText: {
// //     fontSize: 13,
// //     color: '#9ca3af',
// //     marginBottom: 10,
// //   },
// //   questionBox: {
// //     backgroundColor: '#020617',
// //     borderRadius: 16,
// //     padding: 14,
// //     borderWidth: 1,
// //     borderColor: '#111827',
// //   },
// //   prompt: {
// //     fontSize: 16,
// //     color: '#e5e7eb',
// //     marginBottom: 6,
// //     fontWeight: '600',
// //   },
// //   scriptureRef: {
// //     fontSize: 13,
// //     color: '#9ca3af',
// //   },
// //   option: {
// //     borderRadius: 12,
// //     paddingVertical: 10,
// //     paddingHorizontal: 12,
// //     marginTop: 8,
// //     borderWidth: 1,
// //   },
// //   optionText: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //   },
// //   feedback: {
// //     marginTop: 10,
// //     fontSize: 14,
// //     color: '#e5e7eb',
// //   },
// //   submitBtn: {
// //     marginTop: 14,
// //     backgroundColor: Colors.button,
// //     borderRadius: 12,
// //     paddingVertical: 12,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   submitText: {
// //     color: '#fff',
// //     fontWeight: '800',
// //     fontSize: 15,
// //   },
// //   completeLine: {
// //     fontSize: 15,
// //     color: '#2c2487ff',
// //     marginTop: 8,
// //     marginBottom: 14,
// //   },
// //   verseBox: {
// //     marginTop: 4,
// //     padding: 10,
// //     borderRadius: 12,
// //     backgroundColor: '#020617',
// //     borderWidth: 1,
// //     borderColor: '#111827',
// //   },
// //   verseRef: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: '#e5e7eb',
// //     marginBottom: 4,
// //   },
// //   verseText: {
// //     fontSize: 14,
// //     color: '#d1d5db',
// //   },
// //   homeBtn: {
// //     marginTop: 20,
// //     backgroundColor: Colors.button,
// //     paddingVertical: 14,
// //     borderRadius: 14,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   homeBtnText: {
// //     color: '#fff',
// //     fontWeight: '800',
// //     fontSize: 15,
// //   },
// //   journalBtn: {
// //     marginTop: 12,
// //     backgroundColor: Colors.button,
// //     paddingVertical: 14,
// //     borderRadius: 14,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   journalBtnText: {
// //     color: '#fff',
// //     fontWeight: '800',
// //     fontSize: 15,
// //   },
// // });

// //adding animation logic
// // src/screens/QuestScreen.js
// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ScrollView,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Animated,
//   Easing,
// } from 'react-native';

// import Screen from '../components/Screen';
// import { Colors } from '../constants/colors';

// import {
//   getOrCreateTodaysQuest,
//   isQuestCompletedToday,
//   markQuestCompletedToday,
// } from '../logic/dailyQuest';
// import { getTodaysVirtue } from '../logic/dailyVirtue';

// function QuestionOption({
//   label,
//   index,
//   selected,
//   disabled,
//   isCorrect,
//   showResult,
//   onPress,
// }) {
//   let bg = '#1f2937';
//   let border = '#4b5563';
//   let textColor = '#f9fafb';

//   if (disabled && !showResult) {
//     bg = '#111827';
//     border = '#374151';
//     textColor = '#6b7280';
//   }

//   if (showResult) {
//     if (isCorrect) {
//       bg = '#14532d';
//       border = '#22c55e';
//     } else if (selected) {
//       bg = '#7f1d1d';
//       border = '#f97373';
//     }
//   } else if (selected) {
//     bg = '#111827';
//     border = Colors.button;
//   }

//   return (
//     <TouchableOpacity
//       onPress={() => !disabled && onPress(index)}
//       activeOpacity={0.85}
//       disabled={disabled}
//       style={[styles.option, { backgroundColor: bg, borderColor: border }]}
//     >
//       <Text style={[styles.optionText, { color: textColor }]}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// // 🧽 clean up \n and \" from prompts coming from SQL
// function formatPrompt(raw) {
//   if (!raw) return '';
//   return raw.replace(/\\n/g, '\n').replace(/\\"/g, '"');
// }

// export default function QuestScreen({ navigation }) {
//   const [loading, setLoading] = useState(true);
//   const [questCompleted, setQuestCompleted] = useState(false);
//   const [quest, setQuest] = useState(null);
//   const [virtueInfo, setVirtueInfo] = useState(null);
//   const [displayVirtueName, setDisplayVirtueName] = useState('Today');

//   const [index, setIndex] = useState(0);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [lockedWrong, setLockedWrong] = useState([]);
//   const [mode, setMode] = useState('question'); // 'question' | 'review'
//   const [feedback, setFeedback] = useState('');

//   // 🔹 Animation value for the question card (0 = hidden, 1 = fully visible)
//   const cardAnim = useRef(new Animated.Value(0)).current;

//   const animateIn = () => {
//     cardAnim.setValue(0);
//     Animated.timing(cardAnim, {
//       toValue: 1,
//       duration: 220,
//       easing: Easing.out(Easing.ease),
//       useNativeDriver: true,
//     }).start();
//   };

//   const animateOutAndThen = (cb) => {
//     Animated.timing(cardAnim, {
//       toValue: 0,
//       duration: 160,
//       easing: Easing.in(Easing.ease),
//       useNativeDriver: true,
//     }).start(() => {
//       cb && cb();
//       animateIn();
//     });
//   };

//   useEffect(() => {
//     let mounted = true;

//     (async () => {
//       try {
//         const [virtueData, questDone] = await Promise.all([
//           getTodaysVirtue(),
//           isQuestCompletedToday(),
//         ]);

//         if (!mounted) return;

//         setVirtueInfo(virtueData || null);

//         const virtNameFromVirtue =
//           virtueData &&
//           (virtueData.virtue || virtueData.name || virtueData.label);

//         setDisplayVirtueName(virtNameFromVirtue || 'Today');

//         if (questDone) {
//           setQuestCompleted(true);
//           setQuest(null);
//           setLoading(false);
//           return;
//         }

//         // Not completed → load or create today's quest
//         const questData = await getOrCreateTodaysQuest();
//         if (!mounted) return;

//         setQuest(questData || null);

//         const virtNameFromQuest =
//           questData && (questData.virtue || questData.virtueName);

//         if (!virtNameFromVirtue && virtNameFromQuest) {
//           setDisplayVirtueName(virtNameFromQuest);
//         }

//         setQuestCompleted(false);
//         setIndex(0);
//         setSelectedIndex(null);
//         setLockedWrong([]);
//         setMode('question');
//         setFeedback('');

//         // Animate the card in once questions are ready
//         animateIn();
//       } catch (e) {
//         console.warn('Quest load error:', e);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const currentQuestion =
//     quest && quest.questions && quest.questions[index]
//       ? quest.questions[index]
//       : null;

//   const isLastQuestion =
//     quest && quest.questions ? index === quest.questions.length - 1 : false;

//   const handleSelectOption = (i) => {
//     if (mode !== 'question') return;
//     if (lockedWrong.includes(i)) return;
//     setSelectedIndex(i);
//     setFeedback('');
//   };

//   const handleSubmit = () => {
//     if (!currentQuestion || selectedIndex == null) return;

//     const correctIndex = currentQuestion.answerIndex;

//     if (selectedIndex === correctIndex) {
//       let msg = '';

//       if (currentQuestion.type === 'scenario') {
//         msg = `That’s a Christlike response of ${displayVirtueName.toLowerCase()}.`;
//       } else if (currentQuestion.type === 'verse') {
//         msg = 'Well done — hiding God’s Word in your heart matters.';
//       } else if (currentQuestion.type === 'general') {
//         msg =
//           'Great! Growing in knowledge helps you know God and His Word better.';
//       } else {
//         msg = 'Good job!';
//       }

//       setFeedback(msg);
//       setMode('review');
//       return;
//     }

//     // wrong answer
//     const newLocked = Array.from(new Set([...lockedWrong, selectedIndex]));
//     setLockedWrong(newLocked);
//     setSelectedIndex(null);

//     const totalOptions = (currentQuestion.options || []).length;
//     if (newLocked.length >= totalOptions - 1) {
//       // only one option left – reveal the correct one
//       setSelectedIndex(currentQuestion.answerIndex);
//       setMode('review');
//       setFeedback(
//         'Here is the correct answer — let this truth shape your heart today.'
//       );
//     } else {
//       setFeedback('Not quite. Try another option.');
//     }
//   };

//   const handleNext = async () => {
//     if (!quest || !quest.questions) return;

//     if (isLastQuestion) {
//       // 🔹 On the last question, animate the card out first,
//       // then mark the quest as completed and show the completion view.
//       animateOutAndThen(async () => {
//         try {
//           await markQuestCompletedToday();
//         } catch (e) {
//           console.warn('Error marking quest complete:', e);
//         }
//         setQuestCompleted(true);
//         setFeedback('');
//         setMode('question');
//       });
//       return;
//     }

//     // For intermediate questions: animate card out, then swap question & animate in
//     animateOutAndThen(() => {
//       const nextIndex = index + 1;
//       setIndex(nextIndex);
//       setSelectedIndex(null);
//       setLockedWrong([]);
//       setFeedback('');
//       setMode('question');
//     });
//   };

//   const virtueVerseRef = virtueInfo?.verse_ref || null;
//   const virtueVerseText = virtueInfo?.verse_text || null;

//   // ------------- RENDER -------------

//   if (loading) {
//     return (
//       <Screen showBack onBack={() => navigation.goBack()}>
//         <View style={styles.centerWrap}>
//           <ActivityIndicator size="large" color={Colors.button} />
//           <Text style={[styles.subText, { marginTop: 12 }]}>
//             Preparing today’s quest…
//           </Text>
//         </View>
//       </Screen>
//     );
//   }

//   // Completed view or no questions
//   if (
//     questCompleted ||
//     !quest ||
//     !quest.questions ||
//     quest.questions.length === 0
//   ) {
//     return (
//       <Screen showBack onBack={() => navigation.goBack()}>
//         <ScrollView
//           contentContainerStyle={styles.content}
//           showsVerticalScrollIndicator={false}
//         >
//           <Text style={styles.title}>Today’s Quest ✅</Text>

//           <Text style={styles.completeLine}>
//             Now go be the salt of the earth and reflect Christ to those around
//             you, and we’ll have another quest ready tomorrow! 🎚️
//           </Text>

//           <View style={{ height: 12 }} />

//           <Text style={styles.focusLabel}>Today’s Focus</Text>
//           <Text style={styles.focusVirtue}>{displayVirtueName}</Text>

//           {virtueVerseRef || virtueVerseText ? (
//             <View style={styles.verseBox}>
//               {virtueVerseRef ? (
//                 <Text style={styles.verseRef}>{virtueVerseRef}</Text>
//               ) : null}
//               {virtueVerseText ? (
//                 <Text style={styles.verseText}>{virtueVerseText}</Text>
//               ) : null}
//             </View>
//           ) : null}

//           <TouchableOpacity
//             style={styles.homeBtn}
//             activeOpacity={0.9}
//             onPress={() =>
//               navigation.navigate('MainTabs', {
//                 screen: 'Home',
//               })
//             }
//           >
//             <Text style={styles.homeBtnText}>Back to Home</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.journalBtn}
//             activeOpacity={0.9}
//             onPress={() =>
//               navigation.navigate('MainTabs', {
//                 screen: 'Journal',
//                 params: { presetVirtue: displayVirtueName },
//               })
//             }
//           >
//             <Text style={styles.journalBtnText}>
//               Journal About Today’s Focus
//             </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       </Screen>
//     );
//   }

//   // Active quest view
//   const total = quest.questions.length;
//   const qNum = index + 1;
//   const promptText = formatPrompt(currentQuestion.prompt);

//   // Animated style for the question card
//   const animatedCardStyle = {
//     opacity: cardAnim,
//     transform: [
//       {
//         translateY: cardAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: [12, 0], // slide up slightly
//         }),
//       },
//       {
//         scale: cardAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: [0.98, 1], // gentle "pop"
//         }),
//       },
//     ],
//   };

//   return (
//     <Screen showBack onBack={() => navigation.goBack()}>
//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={styles.title}>Today’s Quest 🎯</Text>
//         <Text style={styles.subText}>Growing in obedience to Christ.</Text>

//         <View style={styles.focusRow}>
//           <Text style={styles.focusLabel}>Today’s Focus:</Text>
//           <Text style={styles.focusVirtue}>{displayVirtueName}</Text>
//         </View>

//         <Text style={styles.progressText}>
//           Question {qNum} of {total}
//         </Text>

//         <Animated.View style={[styles.questionBox, animatedCardStyle]}>
//           <Text style={styles.prompt}>{promptText}</Text>

//           {currentQuestion.scriptureRef ? (
//             <Text style={styles.scriptureRef}>
//               {currentQuestion.scriptureRef}
//             </Text>
//           ) : null}

//           <View style={{ height: 10 }} />

//           {(currentQuestion.options || []).map((opt, i) => (
//             <QuestionOption
//               key={i.toString()}
//               label={opt}
//               index={i}
//               selected={selectedIndex === i}
//               disabled={lockedWrong.includes(i)}
//               isCorrect={i === currentQuestion.answerIndex}
//               showResult={mode === 'review'}
//               onPress={handleSelectOption}
//             />
//           ))}

//           {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

//           {mode === 'question' ? (
//             <TouchableOpacity
//               style={[
//                 styles.submitBtn,
//                 selectedIndex == null && { opacity: 0.6 },
//               ]}
//               disabled={selectedIndex == null}
//               activeOpacity={0.9}
//               onPress={handleSubmit}
//             >
//               <Text style={styles.submitText}>Submit</Text>
//             </TouchableOpacity>
//           ) : (
//             <TouchableOpacity
//               style={styles.submitBtn}
//               activeOpacity={0.9}
//               onPress={handleNext}
//             >
//               <Text style={styles.submitText}>
//                 {isLastQuestion ? 'Finish Quest' : 'Next Question'}
//               </Text>
//             </TouchableOpacity>
//           )}
//         </Animated.View>
//       </ScrollView>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({
//   content: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//   },
//   centerWrap: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '800',
//     color: Colors.button,
//     marginBottom: 4,
//   },
//   subText: {
//     fontSize: 15,
//     color: Colors.text,
//     marginBottom: 16,
//   },
//   focusRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//     gap: 6,
//   },
//   focusLabel: {
//     fontSize: 14,
//     color: Colors.text,
//     fontWeight: '600',
//   },
//   focusVirtue: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#fef9c3',
//   },
//   progressText: {
//     fontSize: 13,
//     color: '#9ca3af',
//     marginBottom: 10,
//   },
//   questionBox: {
//     backgroundColor: '#020617',
//     borderRadius: 16,
//     padding: 14,
//     borderWidth: 1,
//     borderColor: '#111827',
//   },
//   prompt: {
//     fontSize: 16,
//     color: '#e5e7eb',
//     marginBottom: 6,
//     fontWeight: '600',
//   },
//   scriptureRef: {
//     fontSize: 13,
//     color: '#9ca3af',
//   },
//   option: {
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//     marginTop: 8,
//     borderWidth: 1,
//   },
//   optionText: {
//     fontSize: 15,
//     fontWeight: '600',
//   },
//   feedback: {
//     marginTop: 10,
//     fontSize: 14,
//     color: '#e5e7eb',
//   },
//   submitBtn: {
//     marginTop: 14,
//     backgroundColor: Colors.button,
//     borderRadius: 12,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   submitText: {
//     color: '#fff',
//     fontWeight: '800',
//     fontSize: 15,
//   },
//   completeLine: {
//     fontSize: 15,
//     color: '#211b66ff',
//     marginTop: 8,
//     marginBottom: 14,
//   },
//   verseBox: {
//     marginTop: 4,
//     padding: 10,
//     borderRadius: 12,
//     backgroundColor: '#020617',
//     borderWidth: 1,
//     borderColor: '#111827',
//   },
//   verseRef: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#e5e7eb',
//     marginBottom: 4,
//   },
//   verseText: {
//     fontSize: 14,
//     color: '#d1d5db',
//   },
//   homeBtn: {
//     marginTop: 20,
//     backgroundColor: Colors.button,
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   homeBtnText: {
//     color: '#fff',
//     fontWeight: '800',
//     fontSize: 15,
//   },
//   journalBtn: {
//     marginTop: 12,
//     backgroundColor: Colors.button,
//     paddingVertical: 14,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   journalBtnText: {
//     color: '#fff',
//     fontWeight: '800',
//     fontSize: 15,
//   },
// });

// adding confetti logic
// src/screens/QuestScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';

import Screen from '../components/Screen';
import { Colors } from '../constants/colors';

import {
  getOrCreateTodaysQuest,
  isQuestCompletedToday,
  markQuestCompletedToday,
} from '../logic/dailyQuest';
import { getTodaysVirtue } from '../logic/dailyVirtue';
import LottieView from 'lottie-react-native';

function QuestionOption({
  label,
  index,
  selected,
  disabled,
  isCorrect,
  showResult,
  onPress,
}) {
  let bg = '#1f2937';
  let border = '#4b5563';
  let textColor = '#f9fafb';

  if (disabled && !showResult) {
    bg = '#111827';
    border = '#374151';
    textColor = '#6b7280';
  }

  if (showResult) {
    if (isCorrect) {
      bg = '#14532d';
      border = '#22c55e';
    } else if (selected) {
      bg = '#7f1d1d';
      border = '#f97373';
    }
  } else if (selected) {
    bg = '#111827';
    border = Colors.button;
  }

  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress(index)}
      activeOpacity={0.85}
      disabled={disabled}
      style={[styles.option, { backgroundColor: bg, borderColor: border }]}
    >
      <Text style={[styles.optionText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// clean up \n and \" from prompts coming from SQL
function formatPrompt(raw) {
  if (!raw) return '';
  return raw.replace(/\\n/g, '\n').replace(/\\"/g, '"');
}

export default function QuestScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [questCompleted, setQuestCompleted] = useState(false);
  const [quest, setQuest] = useState(null);
  const [virtueInfo, setVirtueInfo] = useState(null);
  const [displayVirtueName, setDisplayVirtueName] = useState('Today');

  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [lockedWrong, setLockedWrong] = useState([]);
  const [mode, setMode] = useState('question'); // 'question' | 'review'
  const [feedback, setFeedback] = useState('');

  // confetti state: only true right after finishing today’s quest
  const [playConfetti, setPlayConfetti] = useState(false);
  const confettiRef = useRef(null);

  // animation value for the question card (0 = hidden, 1 = visible)
  const cardAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    cardAnim.setValue(0);
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const animateOutAndThen = (cb) => {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 160,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (cb) cb();
      animateIn();
    });
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // load virtue, quest data, and completion flag together
        const [virtueData, questData, completedFlag] = await Promise.all([
          getTodaysVirtue(),
          getOrCreateTodaysQuest(),
          isQuestCompletedToday(),
        ]);

        if (!mounted) return;

        setVirtueInfo(virtueData || null);
        setQuest(questData || null);

        const virtNameFromVirtue =
          virtueData &&
          (virtueData.virtue || virtueData.name || virtueData.label);
        const virtNameFromQuest =
          questData && (questData.virtue || questData.virtueName);
        const finalVirtueName =
          virtNameFromVirtue || virtNameFromQuest || 'Today';

        setDisplayVirtueName(finalVirtueName);

        const isCompleted =
          !!completedFlag || (questData && questData.completed);

        setQuestCompleted(isCompleted);

        if (!isCompleted && questData && questData.questions?.length) {
          setIndex(0);
          setSelectedIndex(null);
          setLockedWrong([]);
          setMode('question');
          setFeedback('');
          animateIn();
        }

        setLoading(false);
      } catch (e) {
        console.warn('Quest load error:', e);
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const currentQuestion =
    quest && quest.questions && quest.questions[index]
      ? quest.questions[index]
      : null;

  const isLastQuestion =
    quest && quest.questions ? index === quest.questions.length - 1 : false;

  const handleSelectOption = (i) => {
    if (mode !== 'question') return;
    if (lockedWrong.includes(i)) return;
    setSelectedIndex(i);
    setFeedback('');
  };

  const handleSubmit = () => {
    if (!currentQuestion || selectedIndex == null) return;

    const correctIndex = currentQuestion.answerIndex;

    if (selectedIndex === correctIndex) {
      let msg = '';

      if (currentQuestion.type === 'scenario') {
        msg = `That’s a Christlike response of ${displayVirtueName.toLowerCase()}.`;
      } else if (currentQuestion.type === 'verse') {
        msg = 'Well done — hiding God’s Word in your heart matters.';
      } else if (currentQuestion.type === 'general') {
        msg =
          'Great! Growing in knowledge helps you know God and His Word better.';
      } else {
        msg = 'Good job!';
      }

      setFeedback(msg);
      setMode('review');
      return;
    }

    // wrong answer
    const newLocked = Array.from(new Set([...lockedWrong, selectedIndex]));
    setLockedWrong(newLocked);
    setSelectedIndex(null);

    const totalOptions = (currentQuestion.options || []).length;
    if (newLocked.length >= totalOptions - 1) {
      // only one option left – reveal the correct one
      setSelectedIndex(currentQuestion.answerIndex);
      setMode('review');
      setFeedback(
        'Here is the correct answer — let this truth shape your heart today.'
      );
    } else {
      setFeedback('Not quite. Try another option.');
    }
  };

  const handleNext = async () => {
    if (!quest || !quest.questions) return;

    if (isLastQuestion) {
      // last question: animate out, then mark complete and trigger confetti
      animateOutAndThen(async () => {
        try {
          await markQuestCompletedToday();
        } catch (e) {
          console.warn('Error marking quest complete:', e);
        }
        setQuestCompleted(true);
        setFeedback('');
        setMode('question');
        setPlayConfetti(true);
      });
      return;
    }

    // intermediate questions: animate out, switch, animate in
    animateOutAndThen(() => {
      const nextIndex = index + 1;
      setIndex(nextIndex);
      setSelectedIndex(null);
      setLockedWrong([]);
      setFeedback('');
      setMode('question');
    });
  };

  const virtueVerseRef = virtueInfo?.verse_ref || null;
  const virtueVerseText = virtueInfo?.verse_text || null;

  // ---------- RENDER ----------

  if (loading) {
    return (
      <Screen showBack onBack={() => navigation.goBack()}>
        <View style={styles.centerWrap}>
          <ActivityIndicator size="large" color={Colors.button} />
          <Text style={[styles.subText, { marginTop: 12 }]}>
            Preparing today’s quest…
          </Text>
        </View>
      </Screen>
    );
  }

  // completed view or no questions
  if (
    questCompleted ||
    !quest ||
    !quest.questions ||
    quest.questions.length === 0
  ) {
    return (
      <Screen showBack onBack={() => navigation.goBack()}>
        <View style={{ flex: 1 }}>
          {playConfetti && (
            <View style={styles.confettiOverlay} pointerEvents="none">
              <LottieView
                ref={confettiRef}
                source={require('../../assets/animations/confetti.json')}
                autoPlay
                loop={false}
                style={styles.confetti}
                onAnimationFinish={() => setPlayConfetti(false)}
              />
            </View>
          )}

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Today’s Quest ✅</Text>

            <Text style={styles.completeLine}>
              Now go be the salt of the earth and reflect Christ to those around
              you, and we’ll have another quest ready tomorrow! 🎚️
            </Text>

            <View style={{ height: 12 }} />

            <Text style={styles.focusLabel}>Today’s Focus</Text>
            <Text style={styles.focusVirtue}>{displayVirtueName}</Text>

            {virtueVerseRef || virtueVerseText ? (
              <View style={styles.verseBox}>
                {virtueVerseRef ? (
                  <Text style={styles.verseRef}>{virtueVerseRef}</Text>
                ) : null}
                {virtueVerseText ? (
                  <Text style={styles.verseText}>{virtueVerseText}</Text>
                ) : null}
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.homeBtn}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('MainTabs', {
                  screen: 'Home',
                })
              }
            >
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.journalBtn}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('MainTabs', {
                  screen: 'Journal',
                  params: { presetVirtue: displayVirtueName },
                })
              }
            >
              <Text style={styles.journalBtnText}>
                Journal About Today’s Focus
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Screen>
    );
  }

  // active quest view
  const total = quest.questions.length;
  const qNum = index + 1;
  const promptText = formatPrompt(currentQuestion.prompt);

  const animatedCardStyle = {
    opacity: cardAnim,
    transform: [
      {
        translateY: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
      {
        scale: cardAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.98, 1],
        }),
      },
    ],
  };

  return (
    <Screen showBack onBack={() => navigation.goBack()}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Today’s Quest 🎯</Text>
        <Text style={styles.subText}>Growing in obedience to Christ.</Text>

        <View style={styles.focusRow}>
          <Text style={styles.focusLabel}>Today’s Focus:</Text>
          <Text style={styles.focusVirtue}>{displayVirtueName}</Text>
        </View>

        <Text style={styles.progressText}>
          Question {qNum} of {total}
        </Text>

        <Animated.View style={[styles.questionBox, animatedCardStyle]}>
          <Text style={styles.prompt}>{promptText}</Text>

          {currentQuestion.scriptureRef ? (
            <Text style={styles.scriptureRef}>
              {currentQuestion.scriptureRef}
            </Text>
          ) : null}

          <View style={{ height: 10 }} />

          {(currentQuestion.options || []).map((opt, i) => (
            <QuestionOption
              key={i.toString()}
              label={opt}
              index={i}
              selected={selectedIndex === i}
              disabled={lockedWrong.includes(i)}
              isCorrect={i === currentQuestion.answerIndex}
              showResult={mode === 'review'}
              onPress={handleSelectOption}
            />
          ))}

          {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

          {mode === 'question' ? (
            <TouchableOpacity
              style={[
                styles.submitBtn,
                selectedIndex == null && { opacity: 0.6 },
              ]}
              disabled={selectedIndex == null}
              activeOpacity={0.9}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.9}
              onPress={handleNext}
            >
              <Text style={styles.submitText}>
                {isLastQuestion ? 'Finish Quest' : 'Next Question'}
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.button,
    marginBottom: 4,
  },
  subText: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 16,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  focusLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  focusVirtue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fef9c3',
  },
  progressText: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 10,
  },
  questionBox: {
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#111827',
  },
  prompt: {
    fontSize: 16,
    color: '#e5e7eb',
    marginBottom: 6,
    fontWeight: '600',
  },
  scriptureRef: {
    fontSize: 13,
    color: '#9ca3af',
  },
  option: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  feedback: {
    marginTop: 10,
    fontSize: 14,
    color: '#e5e7eb',
  },
  submitBtn: {
    marginTop: 14,
    backgroundColor: Colors.button,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  completeLine: {
    fontSize: 15,
    color: Colors.button,
    marginTop: 8,
    marginBottom: 14,
  },
  verseBox: {
    marginTop: 4,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#111827',
  },
  verseRef: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 4,
  },
  verseText: {
    fontSize: 14,
    color: '#d1d5db',
  },
  homeBtn: {
    marginTop: 20,
    backgroundColor: Colors.button,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  journalBtn: {
    marginTop: 12,
    backgroundColor: Colors.button,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journalBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  confettiOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 80,
    zIndex: 5,
  },
  confetti: {
    width: 260,
    height: 260,
  },
});
