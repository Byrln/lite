import { useState } from "react"
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
        isBot: true
      },
      {
        id: "cancel-reservation",
        question: "FAQ.Question.CancelReservation",
        answer: "FAQ.Answer.CancelReservation",
        isBot: true
      },
      {
        id: "group-booking",
        question: "FAQ.Question.GroupBooking",
        answer: "FAQ.Answer.GroupBooking",
        isBot: true
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

  const currentCategory = faqData.find(cat => cat.id === activeCategory)
  const selectedItem = currentCategory?.items.find(item => item.id === selectedQuestion)

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
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id)
                        setSelectedQuestion(null)
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeCategory === category.id
                        ? "bg-[#804fe6] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {intl.formatMessage({ id: category.title, defaultMessage: category.title })}
                    </button>
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
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-white/80">
                        {intl.formatMessage({ id: "FAQ.Online", defaultMessage: "Online" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {/* Welcome Message */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-[#804fe6] rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon icon="eva:person-outline" className="w-5 h-5 text-white" />
                      </div>
                      <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm max-w-md">
                        <p className="text-gray-800">
                          {intl.formatMessage({ id: "FAQ.WelcomeMessage", defaultMessage: "Hi! I'm here to help you with {category}. Choose a question below to get started:" }, { category: intl.formatMessage({ id: currentCategory?.title || "", defaultMessage: currentCategory?.title || "" }).toLowerCase() })}
                        </p>
                      </div>
                    </div>

                    {/* Question Buttons */}
                    <div className="flex flex-col gap-2 ml-11">
                      {currentCategory?.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSelectedQuestion(item.id)}
                          className={`text-left ml-auto p-3 rounded-lg max-w-md border-2 transition-all ${selectedQuestion === item.id
                            ? "border-[#804fe6] bg-[#804fe6]/5"
                            : "border-gray-200 hover:border-[#804fe6]/50 bg-white"
                            }`}
                        >
                          <span className="text-gray-800 font-medium">
                            {intl.formatMessage({ id: item.question, defaultMessage: item.question })}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Answer */}
                    <AnimatePresence>
                      {selectedItem && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-8 h-8 bg-[#804fe6] rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon icon="eva:person-outline" className="w-5 h-5 text-white" />
                          </div>
                          <div className="bg-white rounded-lg rounded-tl-none p-4 shadow-sm max-w-2xl">
                            <p className="text-gray-800 leading-relaxed">
                              {intl.formatMessage({ id: selectedItem.answer, defaultMessage: selectedItem.answer })}
                            </p>
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-500">
                                {intl.formatMessage({ id: "FAQ.WasHelpful", defaultMessage: "Was this helpful?" })}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <button className="text-green-600 hover:text-green-700">
                                  <Icon icon="eva:thumbs-up-outline" className="w-4 h-4" />
                                </button>
                                <button className="text-red-600 hover:text-red-700">
                                  <Icon icon="eva:thumbs-down-outline" className="w-4 h-4" />
                                </button>
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
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Icon icon="eva:info-outline" className="w-4 h-4" />
                    <span>
                      {intl.formatMessage({ id: "FAQ.SelectQuestion", defaultMessage: "Select a question above to get instant answers" })}
                    </span>
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