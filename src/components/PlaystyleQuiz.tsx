// Playstyle Quiz Component
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { ArrowBack, ArrowForward, CheckCircle } from '@mui/icons-material';
import { PLAYSTYLE_QUESTIONS, PlaystyleAnswers } from '../utils/agent-recommender';

interface PlaystyleQuizProps {
  onComplete: (answers: PlaystyleAnswers) => void;
  onCancel: () => void;
}

const PlaystyleQuiz: React.FC<PlaystyleQuizProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<PlaystyleAnswers>>({});

  const currentQuestion = PLAYSTYLE_QUESTIONS[currentStep];
  const isLastQuestion = currentStep === PLAYSTYLE_QUESTIONS.length - 1;
  const canProceed = answers[currentQuestion.id as keyof PlaystyleAnswers] !== undefined;

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (isLastQuestion && canProceed) {
      onComplete(answers as PlaystyleAnswers);
    } else if (canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const progress = ((currentStep + 1) / PLAYSTYLE_QUESTIONS.length) * 100;

  return (
    <Box sx={{ width: '100%', maxWidth: 700, mx: 'auto' }}>
      {/* Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Питання {currentStep + 1} з {PLAYSTYLE_QUESTIONS.length}
          </Typography>
          <Typography variant="caption" color="primary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <Box
          sx={{
            height: 6,
            borderRadius: 3,
            bgcolor: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #ff4655, #ff6b75)',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={currentStep} sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
        {PLAYSTYLE_QUESTIONS.map((q, index) => (
          <Step key={index}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>

      {/* Question Card */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: 'rgba(26, 31, 46, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 70, 85, 0.3)',
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            mb: 3,
          }}
        >
          {currentQuestion.question}
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={answers[currentQuestion.id as keyof PlaystyleAnswers] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
          >
            {currentQuestion.options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={
                  <Radio
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                    {option.label}
                  </Typography>
                }
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 2,
                  border: '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255, 70, 85, 0.1)',
                    borderColor: 'rgba(255, 70, 85, 0.3)',
                  },
                  ...(answers[currentQuestion.id as keyof PlaystyleAnswers] === option.value && {
                    bgcolor: 'rgba(255, 70, 85, 0.2)',
                    borderColor: 'primary.main',
                  }),
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ minWidth: 120 }}
          >
            {currentStep === 0 ? 'Скасувати' : 'Назад'}
          </Button>

          <Button
            variant="contained"
            endIcon={isLastQuestion ? <CheckCircle /> : <ArrowForward />}
            onClick={handleNext}
            disabled={!canProceed}
            sx={{
              minWidth: 120,
              background: canProceed
                ? 'linear-gradient(45deg, #ff4655, #ff6b75)'
                : undefined,
              '&:hover': {
                background: canProceed
                  ? 'linear-gradient(45deg, #ff6b75, #ff4655)'
                  : undefined,
              },
            }}
          >
            {isLastQuestion ? 'Завершити' : 'Далі'}
          </Button>
        </Box>
      </Paper>

      {/* Help Text */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: 'text.secondary',
          mt: 2,
        }}
      >
        💡 Відповідайте чесно для найкращих рекомендацій
      </Typography>
    </Box>
  );
};

export default PlaystyleQuiz;
