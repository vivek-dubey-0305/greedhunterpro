import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HelpCircle,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  Clock,
  Coins,
  CheckCircle,
  XCircle,
  ListPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader, DataTable, ConfirmDialog, FormModal, ImageUpload } from '../components';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: 'programming' | 'web' | 'database' | 'algorithms' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in minutes
  questions: QuizQuestion[];
  reward: number;
  xpReward: number;
  attempts: number;
  passRate: number;
  status: 'active' | 'draft' | 'archived';
  image: string;
}

const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your JavaScript basics knowledge',
    category: 'programming',
    difficulty: 'easy',
    timeLimit: 15,
    questions: [
      {
        id: 'q1',
        question: 'What is the output of typeof null?',
        options: ['null', 'undefined', 'object', 'string'],
        correctAnswer: 2,
        explanation: 'typeof null returns "object" due to a historical bug in JavaScript.',
      },
      {
        id: 'q2',
        question: 'Which method adds an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0,
      },
    ],
    reward: 50,
    xpReward: 100,
    attempts: 15420,
    passRate: 78,
    status: 'active',
    image: '',
  },
  {
    id: '2',
    title: 'React Advanced Concepts',
    description: 'Master React hooks and patterns',
    category: 'web',
    difficulty: 'hard',
    timeLimit: 30,
    questions: [],
    reward: 150,
    xpReward: 300,
    attempts: 5200,
    passRate: 45,
    status: 'active',
    image: '',
  },
  {
    id: '3',
    title: 'SQL Mastery',
    description: 'Database queries and optimization',
    category: 'database',
    difficulty: 'medium',
    timeLimit: 20,
    questions: [],
    reward: 100,
    xpReward: 200,
    attempts: 8750,
    passRate: 62,
    status: 'active',
    image: '',
  },
];

const categoryColors = {
  programming: '#00ff88',
  web: '#8b5cf6',
  database: '#00d9ff',
  algorithms: '#ffd700',
  general: '#ff6b6b',
};

const difficultyColors = {
  easy: '#00ff88',
  medium: '#ffd700',
  hard: '#ff6b6b',
};

export function QuizzesManagement() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isQuestionsModalOpen, setIsQuestionsModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Partial<Quiz>>({
    title: '',
    description: '',
    category: 'programming',
    difficulty: 'easy',
    timeLimit: 15,
    questions: [],
    reward: 50,
    xpReward: 100,
    status: 'draft',
    image: '',
  });

  const [questionForm, setQuestionForm] = useState<Partial<QuizQuestion>>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
  });

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreate = () => {
    setFormData({
      title: '',
      description: '',
      category: 'programming',
      difficulty: 'easy',
      timeLimit: 15,
      questions: [],
      reward: 50,
      xpReward: 100,
      status: 'draft',
      image: '',
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData(quiz);
    setIsEditModalOpen(true);
  };

  const handleView = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsViewModalOpen(true);
  };

  const handleDelete = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteDialogOpen(true);
  };

  const handleManageQuestions = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setFormData(quiz);
    setIsQuestionsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuiz) {
      setQuizzes(quizzes.filter((q) => q.id !== selectedQuiz.id));
    }
    setIsDeleteDialogOpen(false);
    setSelectedQuiz(null);
  };

  const handleCreateSubmit = () => {
    const newQuiz: Quiz = {
      ...formData as Quiz,
      id: Date.now().toString(),
      attempts: 0,
      passRate: 0,
    };
    setQuizzes([...quizzes, newQuiz]);
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = () => {
    if (selectedQuiz) {
      setQuizzes(quizzes.map((q) => (q.id === selectedQuiz.id ? { ...q, ...formData } : q)));
    }
    setIsEditModalOpen(false);
    setSelectedQuiz(null);
  };

  const addQuestion = () => {
    if (questionForm.question && questionForm.options?.every(o => o)) {
      const newQuestion: QuizQuestion = {
        id: Date.now().toString(),
        question: questionForm.question || '',
        options: questionForm.options || ['', '', '', ''],
        correctAnswer: questionForm.correctAnswer || 0,
        explanation: questionForm.explanation,
      };
      setFormData({
        ...formData,
        questions: [...(formData.questions || []), newQuestion],
      });
      setQuestionForm({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: '',
      });
    }
  };

  const removeQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions?.filter(q => q.id !== questionId) || [],
    });
  };

  const saveQuestions = () => {
    if (selectedQuiz) {
      setQuizzes(quizzes.map((q) => (q.id === selectedQuiz.id ? { ...q, questions: formData.questions || [] } : q)));
    }
    setIsQuestionsModalOpen(false);
  };

  const columns = [
    {
      key: 'quiz',
      header: 'Quiz',
      render: (quiz: Quiz) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${categoryColors[quiz.category]}20` }}
          >
            <HelpCircle className="w-5 h-5" style={{ color: categoryColors[quiz.category] }} />
          </div>
          <div>
            <p className="text-white font-medium">{quiz.title}</p>
            <p className="text-gray-500 text-xs capitalize">{quiz.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'difficulty',
      header: 'Difficulty',
      render: (quiz: Quiz) => (
        <Badge
          variant="outline"
          className="capitalize"
          style={{
            backgroundColor: `${difficultyColors[quiz.difficulty]}20`,
            color: difficultyColors[quiz.difficulty],
            borderColor: `${difficultyColors[quiz.difficulty]}50`,
          }}
        >
          {quiz.difficulty}
        </Badge>
      ),
    },
    {
      key: 'questions',
      header: 'Questions',
      render: (quiz: Quiz) => (
        <span className="text-white">{quiz.questions.length}</span>
      ),
    },
    {
      key: 'timeLimit',
      header: 'Time',
      render: (quiz: Quiz) => (
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-4 h-4" />
          <span>{quiz.timeLimit} min</span>
        </div>
      ),
    },
    {
      key: 'stats',
      header: 'Stats',
      render: (quiz: Quiz) => (
        <div className="text-sm">
          <div className="text-white">{quiz.attempts.toLocaleString()} attempts</div>
          <div className="text-green-400 text-xs">{quiz.passRate}% pass rate</div>
        </div>
      ),
    },
    {
      key: 'reward',
      header: 'Reward',
      render: (quiz: Quiz) => (
        <div className="flex items-center gap-1 text-[#ffd700]">
          <Coins className="w-4 h-4" />
          <span className="font-medium">{quiz.reward}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (quiz: Quiz) => {
        const styles = {
          active: 'bg-green-500/20 text-green-400 border-green-500/30',
          draft: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
          archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        };
        return (
          <Badge variant="outline" className={styles[quiz.status]}>
            {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (quiz: Quiz) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-[#2a2a3e]">
            <DropdownMenuItem
              onClick={() => handleView(quiz)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleEdit(quiz)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Quiz
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleManageQuestions(quiz)}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ListPlus className="w-4 h-4 mr-2" />
              Manage Questions
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2a2a3e]" />
            <DropdownMenuItem
              onClick={() => handleDelete(quiz)}
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Quiz
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const QuizForm = () => (
    <div className="space-y-4">
      <ImageUpload
        value={formData.image}
        onChange={(value) => setFormData({ ...formData, image: value })}
        aspectRatio="video"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Title</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Quiz title"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2 col-span-2">
          <Label className="text-gray-300">Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Quiz description"
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value as Quiz['category'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="database">Database</SelectItem>
              <SelectItem value="algorithms">Algorithms</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Difficulty</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value as Quiz['difficulty'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Time Limit (minutes)</Label>
          <Input
            type="number"
            value={formData.timeLimit}
            onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value as Quiz['status'] })}
          >
            <SelectTrigger className="bg-[#1a1a2e] border-[#2a2a3e] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#2a2a3e]">
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">Coin Reward</Label>
          <Input
            type="number"
            value={formData.reward}
            onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-gray-300">XP Reward</Label>
          <Input
            type="number"
            value={formData.xpReward}
            onChange={(e) => setFormData({ ...formData, xpReward: parseInt(e.target.value) })}
            className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quizzes Management"
        description="Create and manage quizzes with multiple choice questions"
        icon={HelpCircle}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search quizzes..."
        showAddButton
        addButtonText="Create Quiz"
        onAddClick={handleCreate}
        showFilter
      />

      <DataTable
        columns={columns}
        data={paginatedQuizzes}
        keyExtractor={(quiz) => quiz.id}
        emptyMessage="No quizzes found"
        pagination={{
          currentPage,
          totalPages: Math.ceil(filteredQuizzes.length / itemsPerPage),
          onPageChange: setCurrentPage,
          totalItems: filteredQuizzes.length,
          itemsPerPage,
        }}
      />

      {/* Create Modal */}
      <FormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Quiz"
        onSubmit={handleCreateSubmit}
        submitText="Create Quiz"
        size="lg"
      >
        <QuizForm />
      </FormModal>

      {/* Edit Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Quiz"
        onSubmit={handleEditSubmit}
        submitText="Save Changes"
        size="lg"
      >
        <QuizForm />
      </FormModal>

      {/* Questions Modal */}
      <FormModal
        isOpen={isQuestionsModalOpen}
        onClose={() => setIsQuestionsModalOpen(false)}
        title="Manage Questions"
        onSubmit={saveQuestions}
        submitText="Save Questions"
        size="xl"
      >
        <div className="space-y-6">
          {/* Add Question Form */}
          <div className="bg-[#1a1a2e] p-4 rounded-lg space-y-4">
            <h4 className="text-white font-medium">Add New Question</h4>
            <div className="space-y-2">
              <Label className="text-gray-300">Question</Label>
              <Input
                value={questionForm.question}
                onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                placeholder="Enter the question"
                className="bg-[#141420] border-[#2a2a3e] text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {questionForm.options?.map((option, index) => (
                <div key={index} className="space-y-1">
                  <Label className="text-gray-400 text-xs">Option {index + 1}</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(questionForm.options || [])];
                        newOptions[index] = e.target.value;
                        setQuestionForm({ ...questionForm, options: newOptions });
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="bg-[#141420] border-[#2a2a3e] text-white"
                    />
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={questionForm.correctAnswer === index}
                      onChange={() => setQuestionForm({ ...questionForm, correctAnswer: index })}
                      className="w-4 h-4 accent-[#00ff88]"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label className="text-gray-300">Explanation (optional)</Label>
              <Input
                value={questionForm.explanation}
                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                placeholder="Explain the correct answer"
                className="bg-[#141420] border-[#2a2a3e] text-white"
              />
            </div>
            
            <Button
              onClick={addQuestion}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c4ce6] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
          
          {/* Questions List */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Questions ({formData.questions?.length || 0})</h4>
            {formData.questions?.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a1a2e] p-4 rounded-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {index + 1}. {question.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`text-sm px-2 py-1 rounded ${
                            optIndex === question.correctAnswer
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-[#141420] text-gray-400'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            {(!formData.questions || formData.questions.length === 0) && (
              <p className="text-center text-gray-500 py-8">No questions added yet</p>
            )}
          </div>
        </div>
      </FormModal>

      {/* View Modal */}
      <FormModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Quiz Details"
        size="lg"
      >
        {selectedQuiz && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${categoryColors[selectedQuiz.category]}20` }}
              >
                <HelpCircle className="w-8 h-8" style={{ color: categoryColors[selectedQuiz.category] }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedQuiz.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="capitalize"
                    style={{
                      backgroundColor: `${difficultyColors[selectedQuiz.difficulty]}20`,
                      color: difficultyColors[selectedQuiz.difficulty],
                      borderColor: `${difficultyColors[selectedQuiz.difficulty]}50`,
                    }}
                  >
                    {selectedQuiz.difficulty}
                  </Badge>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-400 text-sm">{selectedQuiz.questions.length} questions</span>
                </div>
              </div>
            </div>

            <p className="text-gray-400">{selectedQuiz.description}</p>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <Clock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{selectedQuiz.timeLimit}</p>
                <p className="text-gray-500 text-xs">Minutes</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <Coins className="w-5 h-5 text-[#ffd700] mx-auto mb-2" />
                <p className="text-xl font-bold text-[#ffd700]">{selectedQuiz.reward}</p>
                <p className="text-gray-500 text-xs">Coins</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-green-400">{selectedQuiz.passRate}%</p>
                <p className="text-gray-500 text-xs">Pass Rate</p>
              </div>
              <div className="bg-[#1a1a2e] p-4 rounded-lg text-center">
                <Eye className="w-5 h-5 text-[#8b5cf6] mx-auto mb-2" />
                <p className="text-xl font-bold text-[#8b5cf6]">{selectedQuiz.attempts.toLocaleString()}</p>
                <p className="text-gray-500 text-xs">Attempts</p>
              </div>
            </div>

            {selectedQuiz.questions.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3">Questions Preview</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedQuiz.questions.map((q, i) => (
                    <div key={q.id} className="bg-[#1a1a2e] p-3 rounded-lg">
                      <p className="text-gray-300 text-sm">{i + 1}. {q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </FormModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Quiz"
        description={`Are you sure you want to delete "${selectedQuiz?.title}"? This will remove all questions and data.`}
        confirmText="Delete Quiz"
        variant="danger"
      />
    </div>
  );
}
