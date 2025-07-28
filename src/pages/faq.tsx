import { useState, useEffect } from "react"
import Head from "next/head"
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "framer-motion"
import { useIntl } from "react-intl"
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverButton } from "@/components/ui/popover"
import { Separator } from "@/components/ui"
import { Phone } from "lucide-react"

const title = "FAQ | Horeca"

interface FAQItem {
  id: string
  question: string
  answer: string
  isBot?: boolean
  followUp?: string[]
  quickActions?: { id: string; label: string; action: string }[]
}

interface FAQCategory {
  id: string
  title: string
  items: FAQItem[]
}

const faqData: FAQCategory[] = [
  {
    id: "reservations",
    title: "FAQ.Category.Reservations",
    items: [
      {
        id: "make-reservation",
        question: "FAQ.Question.MakeReservation",
        answer: "FAQ.Answer.MakeReservation",
        isBot: true,
        followUp: ["What payment methods do you accept?", "Can I modify my reservation?", "What's your cancellation policy?"],
        quickActions: [
          { id: "book-now", label: "Book Now", action: "I want to make a reservation right now" },
          { id: "check-rates", label: "Check Rates", action: "Show me current room rates" }
        ]
      },
      {
        id: "cancel-reservation",
        question: "FAQ.Question.CancelReservation",
        answer: "FAQ.Answer.CancelReservation",
        isBot: true,
        followUp: ["Will I get a full refund?", "How long does refund take?", "Can I reschedule instead?"],
        quickActions: [
          { id: "cancel-now", label: "Cancel Reservation", action: "I need to cancel my reservation" },
          { id: "reschedule", label: "Reschedule", action: "I want to reschedule my booking" }
        ]
      },
      {
        id: "group-booking",
        question: "FAQ.Question.GroupBooking",
        answer: "FAQ.Answer.GroupBooking",
        isBot: true,
        followUp: ["What's the minimum group size?", "Do you offer group discounts?", "Can we get connecting rooms?"],
        quickActions: [
          { id: "group-quote", label: "Get Group Quote", action: "I need a quote for group booking" },
          { id: "contact-sales", label: "Contact Sales", action: "Connect me with group sales team" }
        ]
      }
    ]
  },
  {
    id: "front-office",
    title: "FAQ.Category.FrontOffice",
    items: [
      {
        id: "check-in",
        question: "FAQ.Question.CheckIn",
        answer: "FAQ.Answer.CheckIn",
        isBot: true
      },
      {
        id: "walk-in",
        question: "FAQ.Question.WalkIn",
        answer: "FAQ.Answer.WalkIn",
        isBot: true
      },
      {
        id: "night-audit",
        question: "FAQ.Question.NightAudit",
        answer: "FAQ.Answer.NightAudit",
        isBot: true
      }
    ]
  },
  {
    id: "billing",
    title: "FAQ.Category.Billing",
    items: [
      {
        id: "process-payment",
        question: "FAQ.Question.ProcessPayment",
        answer: "FAQ.Answer.ProcessPayment",
        isBot: true
      },
      {
        id: "split-billing",
        question: "FAQ.Question.SplitBilling",
        answer: "FAQ.Answer.SplitBilling",
        isBot: true
      },
      {
        id: "invoicing",
        question: "FAQ.Question.Invoicing",
        answer: "FAQ.Answer.Invoicing",
        isBot: true
      }
    ]
  },
  {
    id: "housekeeping",
    title: "FAQ.Category.Housekeeping",
    items: [
      {
        id: "room-status",
        question: "FAQ.Question.RoomStatus",
        answer: "FAQ.Answer.RoomStatus",
        isBot: true
      },
      {
        id: "maintenance",
        question: "FAQ.Question.Maintenance",
        answer: "FAQ.Answer.Maintenance",
        isBot: true
      }
    ]
  },
  {
    id: "reports",
    title: "FAQ.Category.Reports",
    items: [
      {
        id: "daily-reports",
        question: "FAQ.Question.DailyReports",
        answer: "FAQ.Answer.DailyReports",
        isBot: true
      },
      {
        id: "custom-reports",
        question: "FAQ.Question.CustomReports",
        answer: "FAQ.Answer.CustomReports",
        isBot: true
      }
    ]
  }
]

const FAQPage = () => {
  const intl = useIntl()
  const [activeCategory, setActiveCategory] = useState("reservations")
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [conversationHistory, setConversationHistory] = useState<Array<{ id: string, type: 'question' | 'answer', content: string, timestamp: Date }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [assistantMood, setAssistantMood] = useState<'happy' | 'thinking' | 'helpful'>('happy')

  const currentCategory = faqData.find(cat => cat.id === activeCategory)
  const selectedItem = currentCategory?.items.find(item => item.id === selectedQuestion)

  // Simulate typing effect when answering
  useEffect(() => {
    if (selectedQuestion) {
      setIsTyping(true)
      setAssistantMood('thinking')
      const timer = setTimeout(() => {
        setIsTyping(false)
        setAssistantMood('helpful')
        setShowFollowUp(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [selectedQuestion])

  const handleQuestionSelect = (questionId: string) => {
    const question = currentCategory?.items.find(item => item.id === questionId)
    if (question) {
      setSelectedQuestion(questionId)
      setShowFollowUp(false)
      setConversationHistory(prev => [
        ...prev,
        {
          id: `q-${Date.now()}`,
          type: 'question',
          content: intl.formatMessage({ id: question.question, defaultMessage: question.question }),
          timestamp: new Date()
        }
      ])
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    setSelectedQuestion(null)
    setConversationHistory([])
    setShowFollowUp(false)
    setAssistantMood('happy')
  }

  const handleQuickAction = (action: string) => {
    // Simulate quick actions
    setConversationHistory(prev => [
      ...prev,
      {
        id: `action-${Date.now()}`,
        type: 'question',
        content: action,
        timestamp: new Date()
      }
    ])
  }

  const getAssistantIcon = () => {
    switch (assistantMood) {
      case 'thinking': return 'eva:loader-outline'
      case 'helpful': return 'eva:checkmark-circle-2-outline'
      default: return 'eva:person-outline'
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {intl.formatMessage({ id: "FAQ.Topics", defaultMessage: "Topics" })}
                </h2>
                <Separator className="mb-2" />
                <nav className="space-y-2">
                  {faqData.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${activeCategory === category.id
                        ? "bg-[#804fe6] text-white shadow-lg scale-105"
                        : "text-gray-700 hover:bg-gray-100 hover:scale-102"
                        }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{intl.formatMessage({ id: category.title, defaultMessage: category.title })}</span>
                        {activeCategory === category.id && (
                          <Icon icon="eva:checkmark-outline" className="w-4 h-4" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon icon="eva:headphones-outline" className="w-4 h-4 text-[#804fe6]" />
                      <p className="text-sm text-gray-600">
                        {intl.formatMessage({ id: "FAQ.NeedHelp", defaultMessage: "Need more help?" })}
                      </p>
                    </div>
                    <PopoverRoot>
                      <PopoverTrigger className="flex items-center text-[#804fe6] hover:text-[#6d42c4] text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <p>{intl.formatMessage({ id: "FAQ.ContactSupport", defaultMessage: "Contact Support" })}</p>

                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="h-fit">
                        <PopoverHeader className="bg-[#804fe6] text-white">
                          Contact Information
                        </PopoverHeader>
                        <Separator />
                        <PopoverBody>
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Email</h4>
                              <p className="text-sm text-muted-foreground">support@hotelmanagement.com</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Phone</h4>
                              <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Business Hours</h4>
                              <p className="text-sm text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-1">Emergency Support</h4>
                              <p className="text-sm text-muted-foreground">24/7 Emergency Line: +1 (555) 999-0000</p>
                            </div>
                          </div>
                        </PopoverBody>
                      </PopoverContent>
                    </PopoverRoot>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[700px] flex flex-col">
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200 bg-[#804fe6] text-white rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon icon="eva:message-circle-outline" className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {intl.formatMessage({ id: "FAQ.HotelAssistant", defaultMessage: "Hotel Assistant" })}
                      </h2>
                      <p className="text-white/80 text-sm">
                        {intl.formatMessage({ id: "FAQ.AskAbout", defaultMessage: "Ask me about {category}" }, { category: intl.formatMessage({ id: currentCategory?.title || "", defaultMessage: currentCategory?.title || "" }).toLowerCase() })}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <motion.div
                        className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                      <span className="text-sm text-white/80">
                        {intl.formatMessage({ id: "FAQ.Online", defaultMessage: "Online" })}
                      </span>
                      {isTyping && (
                        <motion.div
                          className="flex gap-1 ml-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    <motion.div
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="w-8 h-8 bg-[#804fe6] rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon icon={getAssistantIcon()} className={`w-5 h-5 text-white ${assistantMood === 'thinking' ? 'animate-spin' : ''}`} />
                      </div>
                      <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm max-w-md">
                        <p className="text-gray-800">
                          {intl.formatMessage({ id: "FAQ.WelcomeMessage", defaultMessage: "Hi! I'm here to help you with {category}. Choose a question below to get started:" }, { category: intl.formatMessage({ id: currentCategory?.title || "", defaultMessage: currentCategory?.title || "" }).toLowerCase() })}
                        </p>
                      </div>
                    </motion.div>

                    {/* Conversation History */}
                    <AnimatePresence>
                      {conversationHistory.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex items-start gap-3 ${message.type === 'question' ? 'flex-row-reverse' : ''}`}
                        >
                          {message.type === 'answer' && (
                            <div className="w-8 h-8 bg-[#804fe6] rounded-full flex items-center justify-center flex-shrink-0">
                              <Icon icon={getAssistantIcon()} className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className={`rounded-lg p-4 shadow-sm max-w-md ${message.type === 'question'
                              ? 'bg-[#804fe6] text-white rounded-tr-none ml-auto'
                              : 'bg-white text-gray-800 rounded-tl-none'
                            }`}>
                            <p className="leading-relaxed">{message.content}</p>
                            <p className={`text-xs mt-2 ${message.type === 'question' ? 'text-white/70' : 'text-gray-500'
                              }`}>
                              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Question Buttons */}
                    {!selectedQuestion && (
                      <motion.div
                        className="flex flex-col gap-2 ml-11"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {currentCategory?.items.map((item, index) => (
                          <motion.button
                            key={item.id}
                            onClick={() => handleQuestionSelect(item.id)}
                            className="text-left ml-auto p-3 rounded-lg max-w-md border-2 transition-all border-gray-200 hover:border-[#804fe6]/50 bg-white hover:shadow-md"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-2">
                              <Icon icon="eva:message-square-outline" className="w-4 h-4 text-[#804fe6]" />
                              <span className="text-gray-800 font-medium">
                                {intl.formatMessage({ id: item.question, defaultMessage: item.question })}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-8 h-8 bg-[#804fe6] rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon icon="eva:loader-outline" className="w-5 h-5 text-white animate-spin" />
                          </div>
                          <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Answer */}
                    <AnimatePresence>
                      {selectedItem && !isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-8 h-8 bg-[#804fe6] rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon icon={getAssistantIcon()} className="w-5 h-5 text-white" />
                          </div>
                          <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm max-w-2xl">
                            <p className="text-gray-800 leading-relaxed">
                              {intl.formatMessage({ id: selectedItem.answer, defaultMessage: selectedItem.answer })}
                            </p>

                            {/* Quick Actions */}
                            {selectedItem.quickActions && selectedItem.quickActions.length > 0 && (
                              <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
                                <div className="flex flex-wrap gap-2">
                                  {selectedItem.quickActions.map((action) => (
                                    <motion.button
                                      key={action.id}
                                      onClick={() => handleQuickAction(action.action)}
                                      className="px-3 py-1 bg-[#804fe6]/10 text-[#804fe6] rounded-full text-sm hover:bg-[#804fe6]/20 transition-colors"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {action.label}
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Follow-up Questions */}
                            {showFollowUp && selectedItem.followUp && selectedItem.followUp.length > 0 && (
                              <motion.div
                                className="mt-4"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ delay: 0.5 }}
                              >
                                <p className="text-sm text-gray-600 mb-2">You might also want to know:</p>
                                <div className="space-y-2">
                                  {selectedItem.followUp.map((followUp, index) => (
                                    <motion.button
                                      key={index}
                                      onClick={() => handleQuickAction(followUp)}
                                      className="block w-full text-left p-2 text-sm text-[#804fe6] hover:bg-[#804fe6]/5 rounded transition-colors"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: 0.1 * index }}
                                      whileHover={{ x: 5 }}
                                    >
                                      • {followUp}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-500">
                                {intl.formatMessage({ id: "FAQ.WasHelpful", defaultMessage: "Was this helpful?" })}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <motion.button
                                  className="text-green-600 hover:text-green-700 p-1 rounded"
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Icon icon="eva:thumbs-up-outline" className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  className="text-red-600 hover:text-red-700 p-1 rounded"
                                  whileHover={{ scale: 1.2 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Icon icon="eva:thumbs-down-outline" className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Chat Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Icon icon="eva:info-outline" className="w-4 h-4" />
                      <span>
                        {selectedQuestion
                          ? intl.formatMessage({ id: "FAQ.ContinueConversation", defaultMessage: "Ask follow-up questions or try quick actions" })
                          : intl.formatMessage({ id: "FAQ.SelectQuestion", defaultMessage: "Select a question above to get instant answers" })
                        }
                      </span>
                    </div>
                    {(selectedQuestion || conversationHistory.length > 0) && (
                      <motion.button
                        onClick={() => {
                          setSelectedQuestion(null)
                          setConversationHistory([])
                          setShowFollowUp(false)
                          setAssistantMood('happy')
                        }}
                        className="flex items-center gap-2 px-3 py-1 text-sm text-[#804fe6] hover:bg-[#804fe6]/10 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon icon="eva:refresh-outline" className="w-4 h-4" />
                        <span>{intl.formatMessage({ id: "FAQ.NewConversation", defaultMessage: "New Conversation" })}</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FAQPage