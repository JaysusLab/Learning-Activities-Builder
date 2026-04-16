// ══════════════════════════════════════════════
// APP INIT — runs after all other scripts load
// ══════════════════════════════════════════════

renderSteps();
renderCards();
renderTimeline();
renderAccordion();
renderStepsPreview();
renderCardsPreview();
renderTimelinePreview();
renderAccordionPreview();

// Apply default background colours to preview viewports
document.getElementById('stepsPreview').style.background = selectedStepsBg;
document.getElementById('cardsPreview').style.background = selectedCardsBg;
document.getElementById('timelinePreview').style.background = selectedTimelineBg;
document.getElementById('accordionPreview').style.background = selectedAccordionBg;
