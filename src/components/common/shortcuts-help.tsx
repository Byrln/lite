import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  Fade,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { Box, Typography, Grid, Chip, Card, CardContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import Iconify from '../iconify';

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

const ShortcutsHelp: React.FC<ShortcutsHelpProps> = ({ open, onClose }) => {
  const intl = useIntl();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [spotlightTarget, setSpotlightTarget] = useState<DOMRect | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get current route and find matching page data
  const currentRoute = router.pathname;
  const shortcuts = intl.messages?.shortcuts as any;
  const pagesData = shortcuts?.pages || [];
  const currentPageData = pagesData.find((page: any) => page.route === currentRoute);

  // Get slides data from current page or fallback to general shortcuts
  const slidesData = currentPageData?.carousel?.slides || shortcuts?.carousel?.slides || [];
  const pageTitle = currentPageData?.title || shortcuts?.title || 'Shortcuts Guide';
  const tipsData = currentPageData?.tips || shortcuts?.tips;

  // Check if current route has specific shortcuts
  const hasRouteSpecificShortcuts = !!currentPageData;

  // Carousel navigation
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);

  // Fullscreen functionality
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const closeFullscreen = () => setIsFullscreen(false);

  // Spotlight functionality
  const handleTryExample = useCallback((targetSelector: string) => {
    const element = document.querySelector(targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setSpotlightTarget(rect);
    }
  }, []);

  const closeSpotlight = useCallback(() => {
    setSpotlightTarget(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'Escape') {
        if (isFullscreen) {
          closeFullscreen();
        } else if (spotlightTarget) {
          closeSpotlight();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, spotlightTarget, isFullscreen, onClose, closeSpotlight]);

  const renderKeyChip = (shortcut: string) => (
    <Chip
      label={shortcut}
      size="small"
      sx={{
        backgroundColor: '#667eea',
        color: '#fff',
        fontFamily: "'Public Sans', 'Noto Sans Mongolian', 'Noto Sans', 'SF Mono', 'Monaco', 'Consolas', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', monospace",
        fontWeight: '600',
        fontSize: '0.75rem',
        height: '28px',
        borderRadius: '6px',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
      }}
    />
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' } as any}
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
        }
      }}
    >
      <Box sx={{ p: { xs: 2, md: 3 }, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" className='font-semibold font-sans'>
            {pageTitle}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 2, md: 3 }, background: 'white' }}>
        {!hasRouteSpecificShortcuts ? (
          // Coming Soon message for routes without specific shortcuts
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '2px solid rgba(147, 51, 234, 0.3)',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(139, 69, 219, 0.1) 0%, transparent 50%)
                `,
                filter: 'blur(60px)',
                zIndex: 1
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  url('/images/grain.jpg'),
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 1px,
                    rgba(147, 51, 234, 0.05) 1px,
                    rgba(147, 51, 234, 0.05) 2px
                  ),
                  repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 1px,
                    rgba(168, 85, 247, 0.03) 1px,
                    rgba(168, 85, 247, 0.03) 2px
                  ),
                  radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.02) 0%, transparent 70%)
                `,
                backgroundSize: '200px 200px, auto, auto, auto',
                backgroundBlendMode: 'overlay, normal, normal, normal',
                opacity: 0.09,
                zIndex: 2
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 2 }}>
                {shortcuts?.comingSoon?.title || 'Coming Soon'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {shortcuts?.comingSoon?.subtitle || 'Page-specific shortcuts for this route are coming soon!'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {shortcuts?.comingSoon?.description || 'In the meantime, you can use the global shortcuts available throughout the application.'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <>
            {/* Carousel */}
            <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', border: '1px solid #eee', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', mb: 3 }}>
              {slidesData.length > 0 && (
                <Fade in key={currentSlide} timeout={400}>
                  <Grid container>
                    <Grid item xs={12} md={6} sx={{ background: '#f8f9fc', position: 'relative' }}>
                      <Box sx={{ height: { xs: 180, md: 290 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box
                          component="img"
                          src={slidesData[currentSlide]?.image || '/static/preview.png'}
                          alt={slidesData[currentSlide]?.title}
                          sx={{ maxWidth: '90%', maxHeight: '100%', borderRadius: 2, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                        />
                      </Box>
                      {/* Fullscreen button */}
                      <IconButton
                        onClick={toggleFullscreen}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(255,255,255,0.9)',
                          '&:hover': { background: 'rgba(255,255,255,1)' },
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                      >
                        <FullscreenIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ p: { xs: 2, md: 3 } }}>
                      <Typography variant="subtitle2" sx={{ color: '#667eea', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }} className='font-sans'>
                        {currentPageData?.carousel?.slideCounter?.replace('{{current}}', (currentSlide + 1).toString()).replace('{{total}}', slidesData.length.toString()) || `Slide ${currentSlide + 1} / ${slidesData.length}`}
                      </Typography>
                      <Typography variant="h6" className='font-bold font-sans my-2'>
                        {slidesData[currentSlide]?.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                        {slidesData[currentSlide]?.description} <b>{slidesData[currentSlide]?.shortcut}</b>
                      </Typography>

                      {/* <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" startIcon={<PlayArrowIcon />} onClick={() => handleTryExample('#shortcut-helper-button')} sx={{
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          boxShadow: '0 8px 20px rgba(118,75,162,0.3)'
                        }}>
                          {currentPageData?.carousel?.tryExample || 'Try Example'}
                        </Button>
                      </Box> */}
                    </Grid>
                  </Grid>
                </Fade>
              )}


              {/* Prev / Next */}
              <IconButton onClick={prevSlide} sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <ArrowBackIosIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={nextSlide} sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Tips Section */}
            {tipsData && (
              <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #eee' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} className='flex items-center gap-2'>
                    <Iconify icon="humbleicons:bulb" className='w-7 h-7 mb-2 text-primary-light' />
                    {tipsData.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className='indent-8'>
                    {tipsData.content}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {/* Summary Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {intl.formatMessage({ id: "TextShortCut" })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {intl.formatMessage({ id: "TextAction" })}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {intl.formatMessage({ id: "TextDescription" })}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {slidesData.map((slide: any, index: number) => (
                    <TableRow key={slide.shortcut || index} hover>
                      <TableCell>{renderKeyChip(slide.shortcut)}</TableCell>
                      <TableCell>{slide.title}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{slide.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      {/* Spotlight overlay */}
      {spotlightTarget && <SpotlightOverlay targetRect={spotlightTarget} onClose={closeSpotlight} />}

      {/* Fullscreen Image Modal */}
      {isFullscreen && (
        <Dialog
          open={isFullscreen}
          onClose={closeFullscreen}
          maxWidth={false}
          fullScreen
          PaperProps={{
            sx: {
              backgroundColor: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box
              component="img"
              src={slidesData[currentSlide]?.image || '/static/preview.png'}
              alt={slidesData[currentSlide]?.title}
              sx={{
                maxWidth: '90%',
                maxHeight: '90%',
                objectFit: 'contain',
                borderRadius: 2,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
              }}
            />
            <IconButton
              onClick={closeFullscreen}
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <FullscreenExitIcon />
            </IconButton>
          </Box>
        </Dialog>
      )}
    </Dialog>
  );
};

export default ShortcutsHelp;

// Spotlight overlay component
const SpotlightOverlay: React.FC<{
  targetRect: DOMRect | null;
  onClose: () => void;
}> = ({ targetRect, onClose }) => {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!targetRect) return null;

  const padding = 12; // breathing space around target
  const r = {
    top: Math.max(0, targetRect.top - padding),
    left: Math.max(0, targetRect.left - padding),
    width: Math.min(viewport.width, targetRect.width + padding * 2),
    height: Math.min(viewport.height, targetRect.height + padding * 2)
  };

  return (
    <Fade in={!!targetRect} timeout={250}>
      <Box
        onClick={onClose}
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          pointerEvents: 'auto'
        }}
      >
        {/* Dark backdrop */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(1px)'
          }}
        />

        {/* Spotlight hole using clipPath */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            WebkitClipPath: `path('M0,0 H${viewport.width} V${viewport.height} H0 Z M${r.left},${r.top} h${r.width} v${r.height} h-${r.width} Z')`,
            clipPath: `path('M0,0 H${viewport.width} V${viewport.height} H0 Z M${r.left},${r.top} h${r.width} v${r.height} h-${r.width} Z')`,
            background: 'rgba(0,0,0,0.6)',
            transition: 'clip-path 250ms ease, -webkit-clip-path 250ms ease',
          }}
        />

        {/* Highlight ring */}
        <Box
          sx={{
            position: 'absolute',
            top: r.top,
            left: r.left,
            width: r.width,
            height: r.height,
            borderRadius: 2,
            boxShadow: '0 0 0 2px #fff, 0 0 0 6px rgba(255,255,255,0.3)',
            pointerEvents: 'none',
            transition: 'all 250ms ease',
          }}
        />
      </Box>
    </Fade>
  );
};