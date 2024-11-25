import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BookOpen, AlertCircle, Trophy, ArrowRight, GripVertical } from 'lucide-react';

const initialCourseData = {
 targetSkill: "Wissenschaftliches Arbeiten",
 units: [
   {
     id: 1,
     title: "Grundlagen des Lesens wissenschaftlicher Texte",
     skill: "Leseprozess",
     prerequisites: [],
     description: "Einführung in die systematische Herangehensweise an wissenschaftliche Texte"
   },
   {
     id: 2,
     title: "Zielgerichtetes Lesen",
     skill: "Zielbestimmung",
     prerequisites: ["Leseprozess"],
     description: "Methoden zur Festlegung und Verfolgung von Lesezielen"
   },
   {
     id: 3,
     title: "Effektive Textdurchsicht",
     skill: "Durchsicht",
     prerequisites: ["Zielbestimmung"],
     description: "Techniken zur effizienten Erfassung von Textinhalten"
   },
   {
     id: 4,
     title: "Nachbereitungstechniken",
     skill: "Nachbereitung",
     prerequisites: ["Durchsicht"],
     description: "Methoden zur Sicherung und Aufbereitung gelesener Inhalte"
   },
   {
     id: 5,
     title: "Wissenschaftliche Recherche",
     skill: "Literatursuche",
     prerequisites: ["Leseprozess"],
     description: "Einführung in die systematische Literaturrecherche"
   }
 ],
 unreachableSkills: [
   {
     name: "Wissenschaftliche Suchmasch.",
     reason: "Keine Lerneinheit zugeordnet"
   },
   {
     name: "Stichwortsuche",
     reason: "Keine Lerneinheit zugeordnet"
   }
 ]
};

const CoursePreview = () => {
 const [courseData, setCourseData] = useState(initialCourseData);
 const [selectedUnit, setSelectedUnit] = useState(null);
 const [isDialogOpen, setIsDialogOpen] = useState(false);
 const [draggedUnit, setDraggedUnit] = useState(null);
 const [dragOverUnit, setDragOverUnit] = useState(null);
 const [errorMessage, setErrorMessage] = useState(null);
 const [highlightedUnit, setHighlightedUnit] = useState(null);

 const handleUnitClick = (unit) => {
   setSelectedUnit(unit);
   setIsDialogOpen(true);
 };

 const handleDragStart = (e, unit) => {
   setDraggedUnit(unit);
   setErrorMessage(null);
   e.dataTransfer.effectAllowed = "move";
 };

 const handleDragOver = (e, unit) => {
   e.preventDefault();
   if (unit.id !== draggedUnit?.id) {
     setDragOverUnit(unit);
   }
 };

 const handleDrop = (e, targetUnit) => {
   e.preventDefault();
   
   if (!draggedUnit || draggedUnit.id === targetUnit.id) return;
 
   const newUnits = [...courseData.units];
   const draggedIndex = newUnits.findIndex(unit => unit.id === draggedUnit.id);
   const targetIndex = newUnits.findIndex(unit => unit.id === targetUnit.id);
 
   const skillsTaughtBefore = newUnits
     .slice(0, targetIndex)
     .map(unit => unit.skill);
 
   const missingPrerequisites = draggedUnit.prerequisites.filter(
     prereq => !skillsTaughtBefore.includes(prereq)
   );
 
   const dependentUnits = newUnits.filter(unit =>
     unit.prerequisites.includes(draggedUnit.skill)
   );
 
   const brokenDependencies = dependentUnits
     .filter(unit => {
       const unitIndex = newUnits.findIndex(u => u.id === unit.id);
       return unitIndex < targetIndex;
     })
     .map(unit => unit.title);
 
   if (missingPrerequisites.length > 0 || brokenDependencies.length > 0) {
     const errorMessages = [];
     if (missingPrerequisites.length > 0) {
       errorMessages.push(`Fehlende Voraussetzungen: ${missingPrerequisites.join(', ')}`);
     }
     if (brokenDependencies.length > 0) {
       errorMessages.push(`Abhängige Einheiten würden getrennt: ${brokenDependencies.join(', ')}`);
     }
     setErrorMessage(errorMessages.join('\n'));
     return;
   }
 
   newUnits.splice(draggedIndex, 1);
   newUnits.splice(targetIndex, 0, draggedUnit);
   setCourseData({ ...courseData, units: newUnits });
   setErrorMessage(null);
   
   // Highlight effect for successful move
   setHighlightedUnit(draggedUnit.id);
   setTimeout(() => setHighlightedUnit(null), 2000);
 
   setDraggedUnit(null);
   setDragOverUnit(null);
 };

 const handleDragEnd = () => {
   setDraggedUnit(null);
   setDragOverUnit(null);
   setTimeout(() => setErrorMessage(null), 6000);
 };

 return (
   <div className="w-full min-h-screen bg-gray-50 p-6">
     {errorMessage && (
       <Alert variant="destructive" className="mb-4">
         <AlertCircle className="h-4 w-4" />
         <AlertTitle>Fehler beim Verschieben</AlertTitle>
         <AlertDescription>{errorMessage}</AlertDescription>
       </Alert>
     )}

     <div className="grid grid-cols-3 gap-6">
       <div className="space-y-6">
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Trophy className="h-5 w-5 text-yellow-500" />
               Kursziel
             </CardTitle>
           </CardHeader>
           <CardContent>
             <p className="text-lg font-medium">{courseData.targetSkill}</p>
             <p className="text-sm text-gray-500 mt-2">
               Dies ist der übergreifende Skill, der durch den erfolgreichen Abschluss 
               aller Lerneinheiten erworben wird.
             </p>
           </CardContent>
         </Card>

         <Card className="border-orange-200">
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-orange-700">
               <AlertCircle className="h-5 w-5" />
               Nicht erreichbare Skills
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-3">
               {courseData.unreachableSkills.map((skill, index) => (
                 <Alert key={index} variant="default" className="bg-orange-50">
                   <AlertTitle>{skill.name}</AlertTitle>
                   <AlertDescription className="text-sm text-orange-600">
                     {skill.reason}
                   </AlertDescription>
                 </Alert>
               ))}
             </div>
           </CardContent>
         </Card>
       </div>

       <div className="col-span-2">
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <BookOpen className="h-5 w-5" />
               Lerneinheiten
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
               {courseData.units.map((unit, index) => (
                 <div key={unit.id} className="relative">
                   <div
                     draggable
                     onDragStart={(e) => handleDragStart(e, unit)}
                     onDragOver={(e) => handleDragOver(e, unit)}
                     onDrop={(e) => handleDrop(e, unit)}
                     onDragEnd={handleDragEnd}
                     className={`
                       relative
                       ${dragOverUnit?.id === unit.id ? 'border-2 border-blue-400 rounded-lg' : ''}
                       ${draggedUnit?.id === unit.id ? 'opacity-50' : ''}
                       ${highlightedUnit === unit.id ? `
                        border-2 border-green-400 
                        shadow-lg
                        scale-[1.02]
                        transition-all duration-500
                      ` : ''}
                     `}
                   >
                     <Button
                       variant="outline"
                       className="w-full justify-start text-left h-auto py-4 px-6 cursor-grab active:cursor-grabbing"
                       onClick={() => handleUnitClick(unit)}
                     >
                       <GripVertical className="h-4 w-4 absolute left-1 top-1/2 -translate-y-1/2 text-gray-400" />
                       <div className="ml-4">
                         <div className="font-medium">{unit.title}</div>
                         <div className="text-sm text-gray-500 mt-1">
                           Vermittelter Skill: {unit.skill}
                         </div>
                       </div>
                     </Button>
                   </div>
                   {index < courseData.units.length - 1 && (
                     <div className="absolute left-1/2 -translate-x-1/2 h-4 flex items-center justify-center">
                       <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
       </div>
     </div>

     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
       <DialogContent className="sm:max-w-lg">
         {selectedUnit && (
           <>
             <DialogHeader>
               <DialogTitle>{selectedUnit.title}</DialogTitle>
               <DialogDescription className="pt-4">
                 {selectedUnit.description}
               </DialogDescription>
             </DialogHeader>
             <div className="space-y-4">
               <div>
                 <h4 className="text-sm font-medium mb-2">Vermittelter Skill:</h4>
                 <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-md">
                   {selectedUnit.skill}
                 </div>
               </div>
               <div>
                 <h4 className="text-sm font-medium mb-2">Voraussetzungen:</h4>
                 {selectedUnit.prerequisites.length > 0 ? (
                   <div className="space-y-2">
                     {selectedUnit.prerequisites.map((prereq, index) => (
                       <div key={index} className="bg-gray-100 px-3 py-2 rounded-md">
                         {prereq}
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-sm text-gray-500">
                     Keine Voraussetzungen erforderlich
                   </div>
                 )}
               </div>
             </div>
           </>
         )}
       </DialogContent>
     </Dialog>
   </div>
 );
};

export default CoursePreview;