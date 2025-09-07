export interface TaskTemplate {
  id: string;
  title: string;
  icon: string;
  description?: string;
  category: 'daily' | 'weekly' | 'monthly';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export const dailyTaskTemplates: TaskTemplate[] = [
  {
    id: '1',
    title: 'تمارين رياضية صباحية',
    icon: '🏃‍♂️',
    description: 'ممارسة التمارين الرياضية لمدة 30 دقيقة',
    category: 'daily',
    priority: 'high',
    tags: ['صحة', 'رياضة', 'صباح'],
  },
  {
    id: '2',
    title: 'بدء يوم العمل',
    icon: '💼',
    description: 'مراجعة المهام والبدء بالعمل',
    category: 'daily',
    priority: 'high',
    tags: ['عمل', 'إنتاجية'],
  },
  {
    id: '3',
    title: 'قراءة كتاب',
    icon: '📖',
    description: 'قراءة 20 صفحة على الأقل',
    category: 'daily',
    priority: 'medium',
    tags: ['تعلم', 'قراءة', 'تطوير'],
  },
  {
    id: '4',
    title: 'وجبات صحية',
    icon: '🍎',
    description: 'تناول وجبات متوازنة وصحية',
    category: 'daily',
    priority: 'high',
    tags: ['صحة', 'طعام'],
  },
  {
    id: '5',
    title: 'شرب الماء',
    icon: '💧',
    description: 'شرب 8 أكواب من الماء يومياً',
    category: 'daily',
    priority: 'medium',
    tags: ['صحة', 'ماء'],
  },
  {
    id: '6',
    title: 'مراجعة البريد الإلكتروني',
    icon: '📧',
    description: 'قراءة والرد على الرسائل المهمة',
    category: 'daily',
    priority: 'medium',
    tags: ['عمل', 'تواصل'],
  },
  {
    id: '7',
    title: 'جلسة تأمل',
    icon: '🧘‍♀️',
    description: 'ممارسة التأمل لمدة 10 دقائق',
    category: 'daily',
    priority: 'medium',
    tags: ['صحة نفسية', 'استرخاء'],
  },
  {
    id: '8',
    title: 'ترتيب السرير',
    icon: '🛏️',
    description: 'ترتيب السرير صباحاً',
    category: 'daily',
    priority: 'low',
    tags: ['نظافة', 'ترتيب'],
  },
  {
    id: '9',
    title: 'المشي',
    icon: '🚶‍♂️',
    description: 'المشي لمدة 30 دقيقة',
    category: 'daily',
    priority: 'medium',
    tags: ['صحة', 'رياضة'],
  },
  {
    id: '10',
    title: 'كتابة المذكرات',
    icon: '📝',
    description: 'كتابة أفكار وملاحظات اليوم',
    category: 'daily',
    priority: 'low',
    tags: ['كتابة', 'تأمل'],
  },
];

export const weeklyTaskTemplates: TaskTemplate[] = [
  {
    id: '11',
    title: 'اجتماع الفريق',
    icon: '👥',
    description: 'اجتماع أسبوعي مع فريق العمل',
    category: 'weekly',
    priority: 'high',
    tags: ['عمل', 'اجتماع', 'فريق'],
  },
  {
    id: '12',
    title: 'زيارة الأهل',
    icon: '🏠',
    description: 'قضاء وقت مع العائلة',
    category: 'weekly',
    priority: 'high',
    tags: ['عائلة', 'اجتماعي'],
  },
  {
    id: '13',
    title: 'التسوق',
    icon: '🛒',
    description: 'شراء احتياجات المنزل',
    category: 'weekly',
    priority: 'medium',
    tags: ['منزل', 'تسوق'],
  },
  {
    id: '14',
    title: 'مراجعة إنجازات الأسبوع',
    icon: '📊',
    description: 'تقييم الإنجازات والتخطيط للأسبوع القادم',
    category: 'weekly',
    priority: 'medium',
    tags: ['تخطيط', 'مراجعة'],
  },
  {
    id: '15',
    title: 'صيانة السيارة',
    icon: '🚗',
    description: 'فحص وصيانة السيارة',
    category: 'weekly',
    priority: 'medium',
    tags: ['صيانة', 'سيارة'],
  },
  {
    id: '16',
    title: 'دورة تدريبية',
    icon: '📚',
    description: 'حضور دورة أو ورشة تدريبية',
    category: 'weekly',
    priority: 'medium',
    tags: ['تعلم', 'تطوير'],
  },
  {
    id: '17',
    title: 'وقت ترفيه',
    icon: '🎬',
    description: 'مشاهدة فيلم أو ممارسة هواية',
    category: 'weekly',
    priority: 'low',
    tags: ['ترفيه', 'استرخاء'],
  },
  {
    id: '18',
    title: 'نسخة احتياطية',
    icon: '💻',
    description: 'عمل نسخة احتياطية للملفات المهمة',
    category: 'weekly',
    priority: 'medium',
    tags: ['تقنية', 'أمان'],
  },
  {
    id: '19',
    title: 'تمارين مكثفة',
    icon: '🏋️‍♂️',
    description: 'جلسة تمارين مكثفة في النادي',
    category: 'weekly',
    priority: 'medium',
    tags: ['صحة', 'رياضة'],
  },
];

export const monthlyTaskTemplates: TaskTemplate[] = [
  {
    id: '20',
    title: 'دفع الفواتير',
    icon: '💰',
    description: 'دفع فواتير الكهرباء والماء والإنترنت',
    category: 'monthly',
    priority: 'high',
    tags: ['مالية', 'فواتير'],
  },
  {
    id: '21',
    title: 'فحوصات طبية',
    icon: '🏥',
    description: 'إجراء الفحوصات الطبية الدورية',
    category: 'monthly',
    priority: 'high',
    tags: ['صحة', 'طبي'],
  },
  {
    id: '22',
    title: 'مراجعة الميزانية',
    icon: '📈',
    description: 'مراجعة الإنفاق والادخار الشهري',
    category: 'monthly',
    priority: 'high',
    tags: ['مالية', 'ميزانية'],
  },
  {
    id: '23',
    title: 'تحديث الأهداف',
    icon: '🎯',
    description: 'مراجعة وتحديث الأهداف الشخصية والمهنية',
    category: 'monthly',
    priority: 'medium',
    tags: ['تخطيط', 'أهداف'],
  },
  {
    id: '24',
    title: 'تنظيم الملفات',
    icon: '🗂️',
    description: 'ترتيب وتنظيم الملفات والوثائق',
    category: 'monthly',
    priority: 'medium',
    tags: ['تنظيم', 'ملفات'],
  },
  {
    id: '25',
    title: 'تقارير شهرية',
    icon: '📊',
    description: 'إعداد التقارير الشهرية للعمل',
    category: 'monthly',
    priority: 'high',
    tags: ['عمل', 'تقارير'],
  },
  {
    id: '26',
    title: 'شراء مستلزمات كبيرة',
    icon: '🛍️',
    description: 'شراء المستلزمات الكبيرة للمنزل',
    category: 'monthly',
    priority: 'medium',
    tags: ['منزل', 'تسوق'],
  },
  {
    id: '27',
    title: 'صيانة وتجديد',
    icon: '🏠',
    description: 'صيانة وتجديد أجزاء من المنزل',
    category: 'monthly',
    priority: 'medium',
    tags: ['منزل', 'صيانة'],
  },
  {
    id: '28',
    title: 'إنهاء كتاب',
    icon: '📚',
    description: 'إنهاء قراءة كتاب كامل',
    category: 'monthly',
    priority: 'low',
    tags: ['قراءة', 'تعلم'],
  },
  {
    id: '29',
    title: 'خطة الشهر القادم',
    icon: '🌟',
    description: 'وضع خطة وأهداف للشهر القادم',
    category: 'monthly',
    priority: 'medium',
    tags: ['تخطيط', 'أهداف'],
  },
];

export const getAllTemplates = () => [
  ...dailyTaskTemplates,
  ...weeklyTaskTemplates,
  ...monthlyTaskTemplates,
];

export const getTemplatesByCategory = (category: 'daily' | 'weekly' | 'monthly') => {
  switch (category) {
    case 'daily':
      return dailyTaskTemplates;
    case 'weekly':
      return weeklyTaskTemplates;
    case 'monthly':
      return monthlyTaskTemplates;
    default:
      return [];
  }
};