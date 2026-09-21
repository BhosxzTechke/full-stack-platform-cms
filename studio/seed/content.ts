// Seed content definitions. Structural data only — the runner (index.ts)
// turns this into full Sanity documents (Portable Text notes, uploaded
// images, resolved video URLs, deterministic ids).

export type CategoryDef = {
  slug: string
  title: string
  description: string
}

export type InstructorDef = {
  slug: string
  name: string
  expertise: string[]
  bio: string
}

export type LessonDef = {
  slug: string
  title: string
  /** 2-4 short specific terms this lesson actually covers. */
  concepts: string[]
  proTip?: string
}

export type ModuleDef = {
  title: string
  summary: string
  lessons: LessonDef[]
}

export type ResourceDef = {
  type: 'link' | 'pdf' | 'download' | 'code'
  title: string
  description: string
  url: string
}

export type CourseDef = {
  slug: string
  title: string
  summary: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  popular?: boolean
  categorySlug: string
  instructorSlug: string
  /** Resource links shared by every lesson in this course (real docs). */
  resources: ResourceDef[]
  learningOutcomes: { icon: string; title: string; description: string }[]
  modules: ModuleDef[]
}

export const categories: CategoryDef[] = [
  {
    slug: 'web-development',
    title: 'Web Development',
    description:
      'Building sites and applications for the browser, from core JavaScript to full-stack frameworks.',
  },
  {
    slug: 'programming-languages',
    title: 'Programming Languages',
    description:
      'Language-focused courses that go deep on syntax, type systems, and idiomatic style.',
  },
  {
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    description:
      'Machine learning and deep learning, from foundational algorithms to modern neural networks.',
  },
  {
    slug: 'data-science',
    title: 'Data Science',
    description:
      'Working with data: cleaning, querying, analyzing, and communicating findings.',
  },
  {
    slug: 'devops-cloud',
    title: 'DevOps & Cloud',
    description:
      'Containers, orchestration, and cloud infrastructure for shipping and running software.',
  },
  {
    slug: 'mobile-development',
    title: 'Mobile Development',
    description: 'Building native and cross-platform apps for iOS and Android.',
  },
]

export const instructors: InstructorDef[] = [
  {
    slug: 'priya-nandakumar',
    name: 'Priya Nandakumar',
    expertise: ['JavaScript', 'React', 'Next.js', 'Web Performance'],
    bio: 'Priya spent eight years building front-end platforms at scale before moving into teaching full-time. She focuses on modern JavaScript and the React ecosystem, with an emphasis on writing code that survives contact with production.',
  },
  {
    slug: 'marcus-webb',
    name: 'Marcus Webb',
    expertise: ['TypeScript', 'Go', 'Backend Systems', 'API Design'],
    bio: "Marcus is a backend engineer turned instructor who has shipped Go services at companies ranging from early-stage startups to large infrastructure teams. He teaches the type systems and language fundamentals he wishes someone had taught him earlier.",
  },
  {
    slug: 'sofia-alvarez',
    name: 'Sofia Alvarez',
    expertise: ['Machine Learning', 'Deep Learning', 'PyTorch', 'Computer Vision'],
    bio: 'Sofia holds a PhD in machine learning and spent several years as a research engineer before teaching. She specializes in making the math behind neural networks approachable without losing the substance.',
  },
  {
    slug: 'daniel-osei',
    name: 'Daniel Osei',
    expertise: ['SQL', 'Python', 'Pandas', 'Data Analysis'],
    bio: 'Daniel worked as a data analyst and later a data engineer for nearly a decade, building the pipelines and dashboards that businesses actually rely on. He teaches practical, workflow-first data skills.',
  },
  {
    slug: 'lena-kowalski',
    name: 'Lena Kowalski',
    expertise: ['Docker', 'Kubernetes', 'AWS', 'Site Reliability'],
    bio: 'Lena is a DevOps engineer who has run production Kubernetes clusters and AWS infrastructure for high-traffic services. She teaches the operational skills that keep systems running at 2 a.m.',
  },
  {
    slug: 'ryo-tanaka',
    name: 'Ryo Tanaka',
    expertise: ['Swift', 'SwiftUI', 'React Native', 'Mobile Architecture'],
    bio: 'Ryo has shipped both native iOS apps and cross-platform React Native apps to millions of users. He teaches mobile development with a focus on architecture choices that age well.',
  },
]

// Trimmed to one course per category (6 total), 2 modules x 2 lessons each
// (24 lessons) per the user's request to scale down from the original plan.
export const courses: CourseDef[] = [
  {
    slug: 'modern-javascript-fundamentals',
    title: 'Modern JavaScript Fundamentals',
    summary:
      'A from-scratch introduction to JavaScript as it is actually written today: variables, functions, data structures, and asynchronous code.',
    level: 'beginner',
    price: 49,
    popular: true,
    categorySlug: 'web-development',
    instructorSlug: 'priya-nandakumar',
    resources: [
      {
        type: 'link',
        title: 'MDN JavaScript Guide',
        description: 'The definitive reference for JavaScript syntax and APIs.',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      },
    ],
    learningOutcomes: [
      { icon: 'code', title: 'Core syntax', description: 'Write JavaScript confidently using modern variable, function, and control-flow syntax.' },
      { icon: 'layers', title: 'Data structures', description: 'Manipulate arrays and objects with the built-in methods used in real codebases.' },
      { icon: 'zap', title: 'Async code', description: 'Understand the event loop and write async code with promises and async/await.' },
    ],
    modules: [
      {
        title: 'Syntax and Variables',
        summary: 'The building blocks: how JavaScript stores and compares values.',
        lessons: [
          { slug: 'variables-and-data-types', title: 'Variables and Data Types', concepts: ['let vs const', 'primitive types', 'template literals'] },
          { slug: 'operators-and-type-coercion', title: 'Operators and Type Coercion', concepts: ['comparison operators', 'implicit coercion', 'strict equality'] },
        ],
      },
      {
        title: 'Functions and Scope',
        summary: 'How JavaScript functions capture and share state.',
        lessons: [
          { slug: 'function-declarations-and-expressions', title: 'Function Declarations and Expressions', concepts: ['named vs anonymous functions', 'hoisting', 'default parameters'] },
          { slug: 'closures-and-scope', title: 'Closures and Scope Chains', concepts: ['lexical scope', 'closures', 'module pattern'] },
        ],
      },
    ],
  },
  {
    slug: 'typescript-deep-dive',
    title: 'TypeScript Deep Dive',
    summary:
      "Go beyond basic types: generics, advanced type inference, and the patterns that make TypeScript's type system worth using.",
    level: 'intermediate',
    price: 79,
    categorySlug: 'programming-languages',
    instructorSlug: 'marcus-webb',
    resources: [
      {
        type: 'link',
        title: 'TypeScript Handbook',
        description: "The official TypeScript language handbook.",
        url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      },
    ],
    learningOutcomes: [
      { icon: 'shield', title: 'Type safety', description: 'Model real-world data accurately with interfaces, unions, and generics.' },
      { icon: 'settings', title: 'Advanced types', description: 'Use mapped and conditional types to eliminate duplication.' },
      { icon: 'wrench', title: 'Real projects', description: 'Configure TypeScript and migrate existing JavaScript codebases.' },
    ],
    modules: [
      {
        title: 'Type Fundamentals',
        summary: 'The core vocabulary of the TypeScript type system.',
        lessons: [
          { slug: 'primitive-and-object-types', title: 'Primitive and Object Types', concepts: ['primitive types', 'object type shapes', 'type inference'] },
          { slug: 'interfaces-vs-type-aliases', title: 'Interfaces vs Type Aliases', concepts: ['interface declarations', 'type aliases', 'when to choose each'] },
        ],
      },
      {
        title: 'Generics',
        summary: 'Writing reusable, type-safe functions and components.',
        lessons: [
          { slug: 'generic-functions', title: 'Generic Functions', concepts: ['type parameters', 'inferred generics', 'default type parameters'] },
          { slug: 'utility-types', title: 'Utility Types', concepts: ['Partial and Pick', 'Omit and Record', 'building custom utility types'] },
        ],
      },
    ],
  },
  {
    slug: 'machine-learning-foundations',
    title: 'Machine Learning Foundations',
    summary:
      'A rigorous but accessible introduction to machine learning: the core algorithms, how to evaluate them, and how to avoid common mistakes.',
    level: 'beginner',
    price: 69,
    popular: true,
    categorySlug: 'artificial-intelligence',
    instructorSlug: 'sofia-alvarez',
    resources: [
      {
        type: 'link',
        title: 'scikit-learn User Guide',
        description: 'Official documentation and worked examples for classical ML in Python.',
        url: 'https://scikit-learn.org/stable/user_guide.html',
      },
    ],
    learningOutcomes: [
      { icon: 'brain', title: 'Core algorithms', description: 'Understand how regression, classification, and clustering algorithms work.' },
      { icon: 'bar-chart', title: 'Model evaluation', description: 'Correctly split data and evaluate models without fooling yourself.' },
      { icon: 'flask-conical', title: 'Practical ML', description: 'Train and tune real models using scikit-learn.' },
    ],
    modules: [
      {
        title: 'ML Fundamentals',
        summary: 'What machine learning is and how to think about it.',
        lessons: [
          { slug: 'what-machine-learning-is', title: 'What Machine Learning Is', concepts: ['learning from data', 'types of ML problems', 'the ML workflow'] },
          { slug: 'supervised-vs-unsupervised', title: 'Supervised vs Unsupervised Learning', concepts: ['labeled vs unlabeled data', 'classification vs regression', 'clustering'] },
        ],
      },
      {
        title: 'Regression',
        summary: 'Predicting continuous and categorical outcomes.',
        lessons: [
          { slug: 'linear-regression', title: 'Linear Regression', concepts: ['the linear model', 'cost functions', 'gradient descent'] },
          { slug: 'logistic-regression', title: 'Logistic Regression', concepts: ['the sigmoid function', 'decision boundaries', 'binary classification'] },
        ],
      },
    ],
  },
  {
    slug: 'python-for-data-analysis-with-pandas',
    title: 'Python for Data Analysis with Pandas',
    summary:
      'Learn to load, clean, transform, and analyze real datasets using pandas — the core skill behind most data work in Python.',
    level: 'beginner',
    price: 59,
    categorySlug: 'data-science',
    instructorSlug: 'daniel-osei',
    resources: [
      {
        type: 'link',
        title: 'pandas Documentation',
        description: 'Official pandas user guide and API reference.',
        url: 'https://pandas.pydata.org/docs/',
      },
    ],
    learningOutcomes: [
      { icon: 'table', title: 'Core pandas', description: 'Load, index, and manipulate data with Series and DataFrames.' },
      { icon: 'filter', title: 'Data cleaning', description: 'Handle missing data and merge datasets from multiple sources.' },
      { icon: 'line-chart', title: 'Analysis', description: 'Summarize and visualize data to answer real questions.' },
    ],
    modules: [
      {
        title: 'Pandas Fundamentals',
        summary: 'The core data structures pandas is built on.',
        lessons: [
          { slug: 'series-and-dataframes', title: 'Series and DataFrames', concepts: ['the Series type', 'the DataFrame type', 'dtypes'] },
          { slug: 'reading-and-writing-data', title: 'Reading and Writing Data', concepts: ['read_csv', 'read_excel and read_json', 'writing data back out'] },
        ],
      },
      {
        title: 'Cleaning and Transforming Data',
        summary: 'Turning messy raw data into something usable.',
        lessons: [
          { slug: 'handling-missing-data', title: 'Handling Missing Data', concepts: ['isna and dropna', 'fillna strategies', 'detecting bad data'] },
          { slug: 'grouping-and-aggregation', title: 'Grouping and Aggregation', concepts: ['groupby', 'aggregate functions', 'pivot tables'] },
        ],
      },
    ],
  },
  {
    slug: 'docker-and-kubernetes-essentials',
    title: 'Docker & Kubernetes Essentials',
    summary:
      'Package applications with Docker and run them reliably at scale with Kubernetes, from a single container to a managed cluster.',
    level: 'intermediate',
    price: 99,
    popular: true,
    categorySlug: 'devops-cloud',
    instructorSlug: 'lena-kowalski',
    resources: [
      {
        type: 'link',
        title: 'Kubernetes Documentation',
        description: 'Official Kubernetes concepts and tasks documentation.',
        url: 'https://kubernetes.io/docs/home/',
      },
    ],
    learningOutcomes: [
      { icon: 'box', title: 'Containers', description: 'Package applications into Docker images and run them with Compose.' },
      { icon: 'boxes', title: 'Kubernetes basics', description: 'Deploy and manage workloads with pods, deployments, and services.' },
      { icon: 'settings-2', title: 'Cluster operations', description: 'Scale, monitor, and manage releases on a running cluster.' },
    ],
    modules: [
      {
        title: 'Containers with Docker',
        summary: 'Packaging an application so it runs anywhere.',
        lessons: [
          { slug: 'images-and-containers', title: 'Images and Containers', concepts: ['image layers', 'containers vs images', 'the Docker daemon'] },
          { slug: 'writing-a-dockerfile', title: 'Writing a Dockerfile', concepts: ['FROM and RUN', 'multi-stage builds', 'minimizing image size'] },
        ],
      },
      {
        title: 'Kubernetes Fundamentals',
        summary: 'The core objects Kubernetes is built on.',
        lessons: [
          { slug: 'pods-deployments-and-services', title: 'Pods, Deployments, and Services', concepts: ['pod lifecycle', 'Deployments and replica sets', 'Service types'] },
          { slug: 'configmaps-and-secrets', title: 'ConfigMaps and Secrets', concepts: ['externalizing config', 'mounting as env vars or files', 'secret storage'] },
        ],
      },
    ],
  },
  {
    slug: 'ios-app-development-with-swift',
    title: 'iOS App Development with Swift',
    summary:
      'Build real iOS apps with Swift and SwiftUI, from language fundamentals through architecture to shipping on the App Store.',
    level: 'intermediate',
    price: 95,
    categorySlug: 'mobile-development',
    instructorSlug: 'ryo-tanaka',
    resources: [
      {
        type: 'link',
        title: 'Swift Documentation',
        description: "Apple's official Swift language documentation.",
        url: 'https://www.swift.org/documentation/',
      },
    ],
    learningOutcomes: [
      { icon: 'smartphone', title: 'Swift fundamentals', description: 'Write safe, expressive Swift using optionals and protocols.' },
      { icon: 'layout-grid', title: 'SwiftUI', description: 'Build declarative UIs with state-driven views.' },
      { icon: 'upload', title: 'Ship an app', description: 'Architect, test, and submit an app to the App Store.' },
    ],
    modules: [
      {
        title: 'Swift Fundamentals',
        summary: 'The language underneath every iOS app.',
        lessons: [
          { slug: 'variables-optionals-and-types', title: 'Variables, Optionals, and Types', concepts: ['type inference', 'optionals', 'optional binding'] },
          { slug: 'functions-and-closures', title: 'Functions and Closures', concepts: ['function signatures', 'closures', 'trailing closure syntax'] },
        ],
      },
      {
        title: 'Building UI with SwiftUI',
        summary: 'Declarative UI, from views to navigation.',
        lessons: [
          { slug: 'views-and-modifiers', title: 'Views and Modifiers', concepts: ['the View protocol', 'modifier chaining', 'view composition'] },
          { slug: 'state-and-data-binding', title: 'State and Data Binding', concepts: ['@State and @Binding', '@Observable', 'data flow'] },
        ],
      },
    ],
  },
]
