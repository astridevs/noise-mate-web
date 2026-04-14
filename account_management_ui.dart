import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

void main() {
  runApp(const NoiseMatWebApp());
}

// ============================================================================
// ENUMS & MODELS
// ============================================================================

enum PlanTier { free, plus, pro }

enum SortBy { newest, oldest, highestDb }

class MockAppState {
  static final MockAppState _instance = MockAppState._internal();
  PlanTier currentPlan = PlanTier.free;
  bool isLoggedIn = false;
  bool isDarkMode = false;
  ValueNotifier<int> rebuildNotifier = ValueNotifier(0);

  factory MockAppState() {
    return _instance;
  }

  MockAppState._internal();

  void triggerRebuild() {
    rebuildNotifier.value++;
  }
}

class LogEntry {
  final String id;
  final String title;
  final DateTime occurredAt;
  final int duration; // minutes
  final int peakDb;
  final String locationText;
  final String notesPreview;
  final bool hasAudio;
  String? notes;
  final String? tags;

  LogEntry({
    required this.id,
    required this.title,
    required this.occurredAt,
    required this.duration,
    required this.peakDb,
    required this.locationText,
    required this.notesPreview,
    required this.hasAudio,
    this.notes,
    this.tags,
  });
}

// ============================================================================
// MAIN APP
// ============================================================================

class NoiseMatWebApp extends StatefulWidget {
  const NoiseMatWebApp({Key? key}) : super(key: key);

  @override
  State<NoiseMatWebApp> createState() => _NoiseMatWebAppState();
}

class _NoiseMatWebAppState extends State<NoiseMatWebApp> {
  final appState = MockAppState();
  late GoRouter _router;

  @override
  void initState() {
    super.initState();
    _router = _buildRouter();
    // Listen to rebuild notifier to update theme
    appState.rebuildNotifier.addListener(_onRebuild);
  }

  void _onRebuild() {
    setState(() {});
  }

  @override
  void dispose() {
    appState.rebuildNotifier.removeListener(_onRebuild);
    super.dispose();
  }

  GoRouter _buildRouter() {
    return GoRouter(
      debugLogDiagnostics: true,
      redirect: (context, state) {
        final isLoggedIn = appState.isLoggedIn;
        final path = state.matchedLocation;

        if (!isLoggedIn && !['/login', '/signup', '/'].contains(path)) {
          return '/login';
        }
        if (isLoggedIn && ['/login', '/signup'].contains(path)) {
          return '/dashboard';
        }
        return null;
      },
      routes: [
        GoRoute(
          path: '/',
          builder: (context, state) => const LandingPage(),
        ),
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginPage(),
        ),
        GoRoute(
          path: '/signup',
          builder: (context, state) => const SignupPage(),
        ),
        GoRoute(
          path: '/dashboard',
          builder: (context, state) => const DashboardPage(),
        ),
        GoRoute(
          path: '/logs',
          builder: (context, state) => const LogsPage(),
        ),
        GoRoute(
          path: '/log/:id',
          builder: (context, state) {
            final id = state.pathParameters['id'] ?? '1';
            return LogDetailPage(logId: id);
          },
        ),
        GoRoute(
          path: '/account',
          builder: (context, state) => const AccountPage(),
        ),
        GoRoute(
          path: '/upgrade',
          builder: (context, state) => const UpgradePage(),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Noise Mate',
      debugShowCheckedModeBanner: false,
      theme: _buildLightTheme(),
      darkTheme: _buildDarkTheme(),
      themeMode: appState.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      routerConfig: _router,
    );
  }

  ThemeData _buildLightTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: const Color(0xFF2563EB),
      scaffoldBackgroundColor: Colors.white,
      fontFamily: 'Plus Jakarta Sans',
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: 48,
          fontWeight: FontWeight.bold,
          color: Color(0xFF1A1A1A),
        ),
        displayMedium: TextStyle(
          fontSize: 36,
          fontWeight: FontWeight.bold,
          color: Color(0xFF1A1A1A),
        ),
        headlineSmall: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Color(0xFF1A1A1A),
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          color: Color(0xFF4B5563),
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          color: Color(0xFF6B7280),
        ),
      ),
      colorScheme: ColorScheme.light(
        primary: const Color(0xFF2563EB),
        surface: Colors.white,
        surfaceVariant: const Color(0xFFF5F6FA),
      ),
    );
  }

  ThemeData _buildDarkTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: const Color(0xFF2563EB),
      scaffoldBackgroundColor: const Color(0xFF0A0F1C),
      fontFamily: 'Plus Jakarta Sans',
      textTheme: const TextTheme(
        displayLarge: TextStyle(
          fontSize: 48,
          fontWeight: FontWeight.bold,
          color: Color(0xFFFFFFFF),
        ),
        displayMedium: TextStyle(
          fontSize: 36,
          fontWeight: FontWeight.bold,
          color: Color(0xFFFFFFFF),
        ),
        headlineSmall: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Color(0xFFFFFFFF),
        ),
        bodyLarge: TextStyle(
          fontSize: 16,
          color: Color(0xFFCBD5E1),
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          color: Color(0xFF94A3B8),
        ),
      ),
      colorScheme: ColorScheme.dark(
        primary: const Color(0xFF2563EB),
        surface: const Color(0xFF111827),
        surfaceVariant: const Color(0xFF1E293B),
      ),
    );
  }
}

// ============================================================================
// PAGES
// ============================================================================

class LandingPage extends StatelessWidget {
  const LandingPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = MockAppState();
    
    return Scaffold(
      body: Stack(
        children: [
          // Hero gradient background
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Theme.of(context).primaryColor.withOpacity(0.05),
                  Colors.transparent,
                ],
              ),
            ),
          ),
          // Content
          SingleChildScrollView(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1120),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 80, horizontal: 32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Logo/Wordmark
                      Text(
                        'Noise Mate',
                        style: Theme.of(context).textTheme.displayLarge?.copyWith(
                          fontSize: 64,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Subtitle
                      Text(
                        'Record, manage, and export noise evidence for your council.',
                        style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          fontSize: 24,
                          fontWeight: FontWeight.normal,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 32),
                      
                      // Description
                      SizedBox(
                        width: 500,
                        child: Text(
                          'Account management portal for Noise Mate. Sign in to your account or create a new one to get started.',
                          style: Theme.of(context).textTheme.bodyLarge,
                          textAlign: TextAlign.center,
                        ),
                      ),
                      const SizedBox(height: 48),
                      
                      // CTA Buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          PillButton(
                            label: 'Sign In',
                            onPressed: () => context.go('/login'),
                            primary: true,
                          ),
                          const SizedBox(width: 16),
                          PillButton(
                            label: 'Create Account',
                            onPressed: () => context.go('/signup'),
                            primary: false,
                          ),
                        ],
                      ),
                      const SizedBox(height: 80),
                      
                      // Feature cards
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Expanded(
                            child: CardContainer(
                              child: Padding(
                                padding: const EdgeInsets.all(24),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Icon(Icons.description, size: 32, color: Theme.of(context).primaryColor),
                                    const SizedBox(height: 12),
                                    Text('Manage Logs', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 8),
                                    Text('View, edit, and organize your noise recordings.', style: Theme.of(context).textTheme.bodyMedium),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: CardContainer(
                              child: Padding(
                                padding: const EdgeInsets.all(24),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Icon(Icons.file_download, size: 32, color: Theme.of(context).primaryColor),
                                    const SizedBox(height: 12),
                                    Text('Export Evidence', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 8),
                                    Text('Generate standardized PDF reports.', style: Theme.of(context).textTheme.bodyMedium),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: CardContainer(
                              child: Padding(
                                padding: const EdgeInsets.all(24),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Icon(Icons.verified, size: 32, color: Theme.of(context).primaryColor),
                                    const SizedBox(height: 12),
                                    Text('Professional', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 8),
                                    Text('Council-approved privacy & security.', style: Theme.of(context).textTheme.bodyMedium),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          
          // Top right theme toggle
          Positioned(
            top: 16,
            right: 16,
            child: GestureDetector(
              onTap: () {
                appState.isDarkMode = !appState.isDarkMode;
                appState.triggerRebuild();
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Theme.of(context).primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    Icon(
                      appState.isDarkMode ? Icons.dark_mode : Icons.light_mode,
                      size: 16,
                      color: Theme.of(context).primaryColor,
                    ),
                    const SizedBox(width: 6),
                    Text('Dev', style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 11)),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final appState = MockAppState();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Noise Mate'),
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Theme.of(context).textTheme.bodyLarge?.color,
        actions: [
          TextButton(
            onPressed: () => context.go('/'),
            child: const Text('← Back to site'),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: SizedBox(
              width: 400,
              child: Column(
                children: [
                  Text('Welcome back', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 8),
                  Text(
                    'Sign in to your account',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 32),
                  PillInput(
                    label: 'Email',
                    controller: emailController,
                    hint: 'you@example.com',
                  ),
                  const SizedBox(height: 16),
                  PillInput(
                    label: 'Password',
                    controller: passwordController,
                    obscure: true,
                    hint: '••••••••',
                  ),
                  const SizedBox(height: 32),
                  PillButton(
                    label: 'Sign In',
                    onPressed: () {
                      appState.isLoggedIn = true;
                      setState(() {});
                      context.go('/dashboard');
                    },
                    primary: true,
                    fullWidth: true,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Don\'t have an account? ', style: Theme.of(context).textTheme.bodyMedium),
                      GestureDetector(
                        onTap: () => context.go('/signup'),
                        child: Text(
                          'Sign up',
                          style: TextStyle(
                            color: Theme.of(context).primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class SignupPage extends StatefulWidget {
  const SignupPage({Key? key}) : super(key: key);

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final nameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final appState = MockAppState();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Noise Mate'),
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Theme.of(context).textTheme.bodyLarge?.color,
        actions: [
          TextButton(
            onPressed: () => context.go('/'),
            child: const Text('← Back to site'),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: SizedBox(
              width: 400,
              child: Column(
                children: [
                  Text('Create account', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 8),
                  Text(
                    'Start recording noise evidence today',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 32),
                  PillInput(
                    label: 'Full name',
                    controller: nameController,
                    hint: 'John Doe',
                  ),
                  const SizedBox(height: 16),
                  PillInput(
                    label: 'Email',
                    controller: emailController,
                    hint: 'you@example.com',
                  ),
                  const SizedBox(height: 16),
                  PillInput(
                    label: 'Password',
                    controller: passwordController,
                    obscure: true,
                    hint: '••••••••',
                  ),
                  const SizedBox(height: 32),
                  PillButton(
                    label: 'Create Account',
                    onPressed: () {
                      appState.isLoggedIn = true;
                      setState(() {});
                      context.go('/dashboard');
                    },
                    primary: true,
                    fullWidth: true,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Already have an account? ', style: Theme.of(context).textTheme.bodyMedium),
                      GestureDetector(
                        onTap: () => context.go('/login'),
                        child: Text(
                          'Sign in',
                          style: TextStyle(
                            color: Theme.of(context).primaryColor,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class DashboardPage extends StatefulWidget {
  const DashboardPage({Key? key}) : super(key: key);

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  Widget build(BuildContext context) {
    final appState = MockAppState();

    if (appState.currentPlan == PlanTier.free) {
      return AppScaffold(
        currentPage: 'Dashboard',
        child: SingleChildScrollView(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 1120),
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: GateScreen(
                  title: 'Logs only on mobile free tier',
                  subtitle: 'Switch to Plus to view and manage logs on web',
                  buttonLabel: 'Upgrade to Plus',
                  onPressed: () => context.go('/upgrade'),
                  icon: Icons.lock_outline,
                ),
              ),
            ),
          ),
        ),
      );
    }

    return AppScaffold(
      currentPage: 'Dashboard',
      child: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1120),
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Welcome card
                  CardContainer(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Welcome back', style: Theme.of(context).textTheme.headlineSmall),
                              const SizedBox(height: 8),
                              Text(
                                'You\'re tracking noise in your council area.',
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                            ],
                          ),
                          Container(
                            width: 100,
                            height: 100,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Theme.of(context).primaryColor.withOpacity(0.1),
                            ),
                            child: Icon(
                              Icons.sounds_wave,
                              size: 48,
                              color: Theme.of(context).primaryColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Stats row
                  Row(
                    children: [
                      Expanded(
                        child: _StatCard(
                          title: 'Records this week',
                          value: '7',
                          context: context,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _StatCard(
                          title: 'Most common time',
                          value: '10 PM',
                          context: context,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _StatCard(
                          title: 'Average peak dB',
                          value: '82',
                          context: context,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Quick actions
                  Text('Quick actions', style: Theme.of(context).textTheme.headlineSmall),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: CardContainer(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(Icons.description, color: Theme.of(context).primaryColor),
                                const SizedBox(height: 12),
                                Text('View logs', style: Theme.of(context).textTheme.bodyLarge),
                                const SizedBox(height: 8),
                                PillButton(
                                  label: 'Go to logs',
                                  onPressed: () => context.go('/logs'),
                                  primary: true,
                                  compact: true,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: CardContainer(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(Icons.download, color: Theme.of(context).primaryColor),
                                const SizedBox(height: 12),
                                Text('Download last audio', style: Theme.of(context).textTheme.bodyLarge),
                                const SizedBox(height: 8),
                                PillButton(
                                  label: 'Download',
                                  onPressed: () {},
                                  primary: false,
                                  compact: true,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: CardContainer(
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(
                                  Icons.security,
                                  color: appState.currentPlan == PlanTier.pro
                                      ? Theme.of(context).primaryColor
                                      : Colors.grey,
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  'Export PDF',
                                  style: Theme.of(context).textTheme.bodyLarge,
                                ),
                                const SizedBox(height: 8),
                                PillButton(
                                  label: appState.currentPlan == PlanTier.pro ? 'Export' : 'Pro only',
                                  onPressed: appState.currentPlan == PlanTier.pro ? () {} : null,
                                  primary: appState.currentPlan == PlanTier.pro,
                                  compact: true,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Plan card
                  CardContainer(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Your plan', style: Theme.of(context).textTheme.headlineSmall),
                              const SizedBox(height: 8),
                              PlanBadge(tier: appState.currentPlan),
                            ],
                          ),
                          PillButton(
                            label: 'View pricing',
                            onPressed: () => context.go('/upgrade'),
                            primary: false,
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final BuildContext context;

  const _StatCard({
    required this.title,
    required this.value,
    required this.context,
  });

  @override
  Widget build(BuildContext context) {
    return CardContainer(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 12),
            Text(value, style: Theme.of(context).textTheme.displayMedium),
          ],
        ),
      ),
    );
  }
}

class LogsPage extends StatefulWidget {
  const LogsPage({Key? key}) : super(key: key);

  @override
  State<LogsPage> createState() => _LogsPageState();
}

class _LogsPageState extends State<LogsPage> {
  SortBy sortBy = SortBy.newest;
  String filterChip = '';
  int currentPage = 0;
  final pageSize = 5;

  final mockLogs = [
    LogEntry(
      id: '1',
      title: 'Loud music from next door',
      occurredAt: DateTime.now().subtract(const Duration(hours: 2)),
      duration: 45,
      peakDb: 87,
      locationText: 'Living room',
      notesPreview: 'Very loud music, couldn\'t sleep',
      hasAudio: true,
      tags: 'Night, Music',
    ),
    LogEntry(
      id: '2',
      title: 'Traffic noise on main road',
      occurredAt: DateTime.now().subtract(const Duration(days: 1)),
      duration: 30,
      peakDb: 82,
      locationText: 'Bedroom',
      notesPreview: 'Heavy truck traffic',
      hasAudio: true,
      tags: 'Day, Traffic',
    ),
    LogEntry(
      id: '3',
      title: 'Construction work',
      occurredAt: DateTime.now().subtract(const Duration(days: 2)),
      duration: 120,
      peakDb: 91,
      locationText: 'Balcony',
      notesPreview: 'Drilling and hammering',
      hasAudio: true,
      tags: 'Day, Construction',
    ),
    LogEntry(
      id: '4',
      title: 'Dog barking',
      occurredAt: DateTime.now().subtract(const Duration(days: 3)),
      duration: 15,
      peakDb: 78,
      locationText: 'Hallway',
      notesPreview: 'Continuous barking for 15 mins',
      hasAudio: true,
      tags: 'Day, Animal',
    ),
    LogEntry(
      id: '5',
      title: 'Party noise',
      occurredAt: DateTime.now().subtract(const Duration(days: 4)),
      duration: 180,
      peakDb: 89,
      locationText: 'Living room',
      notesPreview: 'Music and loud voices until 2am',
      hasAudio: true,
      tags: 'Night, Music',
    ),
    LogEntry(
      id: '6',
      title: 'Lawn mower',
      occurredAt: DateTime.now().subtract(const Duration(days: 5)),
      duration: 45,
      peakDb: 84,
      locationText: 'Garden window',
      notesPreview: 'Neighbour using lawn mower at 7am',
      hasAudio: true,
      tags: 'Day, Maintenance',
    ),
    LogEntry(
      id: '7',
      title: 'Delivery truck beeping',
      occurredAt: DateTime.now().subtract(const Duration(days: 6)),
      duration: 5,
      peakDb: 80,
      locationText: 'Street',
      notesPreview: 'Repetitive beeping',
      hasAudio: true,
      tags: 'Day, Traffic',
    ),
    LogEntry(
      id: '8',
      title: 'Sirens passing',
      occurredAt: DateTime.now().subtract(const Duration(days: 7)),
      duration: 3,
      peakDb: 86,
      locationText: 'Bedroom',
      notesPreview: 'Emergency vehicle sirens',
      hasAudio: true,
      tags: 'Night, Emergency',
    ),
    LogEntry(
      id: '9',
      title: 'Alarm sounds',
      occurredAt: DateTime.now().subtract(const Duration(days: 8)),
      duration: 2,
      peakDb: 85,
      locationText: 'Building',
      notesPreview: 'Car alarm from street',
      hasAudio: false,
      tags: 'Night, Alarm',
    ),
    LogEntry(
      id: '10',
      title: 'Music rehearsal',
      occurredAt: DateTime.now().subtract(const Duration(days: 9)),
      duration: 90,
      peakDb: 88,
      locationText: 'Shared wall',
      notesPreview: 'Drums and guitar playing',
      hasAudio: true,
      tags: 'Night, Music',
    ),
    LogEntry(
      id: '11',
      title: 'Ventilation system',
      occurredAt: DateTime.now().subtract(const Duration(days: 10)),
      duration: 120,
      peakDb: 76,
      locationText: 'Bedroom ceiling',
      notesPreview: 'Background hum from HVAC',
      hasAudio: true,
      tags: 'Day, Mechanical',
    ),
    LogEntry(
      id: '12',
      title: 'Children playing',
      occurredAt: DateTime.now().subtract(const Duration(days: 11)),
      duration: 60,
      peakDb: 81,
      locationText: 'Garden',
      notesPreview: 'Screaming and running',
      hasAudio: false,
      tags: 'Day, Activity',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final appState = MockAppState();

    if (appState.currentPlan == PlanTier.free) {
      return AppScaffold(
        currentPage: 'Logs',
        child: SingleChildScrollView(
          child: Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 1120),
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: GateScreen(
                  title: 'Logs on web require Plus',
                  subtitle: 'Switch to Plus or Pro to manage your logs on web. Mobile users can view basic history.',
                  buttonLabel: 'Upgrade to Plus',
                  onPressed: () => context.go('/upgrade'),
                  icon: Icons.lock_outline,
                ),
              ),
            ),
          ),
        ),
      );
    }

    return AppScaffold(
      currentPage: 'Logs',
      child: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1120),
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Your logs', style: Theme.of(context).textTheme.displayMedium),
                          const SizedBox(height: 8),
                          Text(
                            'Structured evidence for your council submissions',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          if (appState.currentPlan == PlanTier.pro)
                            PillButton(
                              label: 'Export PDF',
                              onPressed: () {},
                              primary: true,
                            ),
                          const SizedBox(width: 12),
                          PillButton(
                            label: '+ New upload',
                            onPressed: () {},
                            primary: false,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Search and filters
                  Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: PillInput(
                          label: '',
                          hint: 'Search logs...',
                          controller: TextEditingController(),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: DropdownButtonFormField<String>(
                          value: 'All dates',
                          items: const [
                            DropdownMenuItem(value: 'All dates', child: Text('All dates')),
                            DropdownMenuItem(value: '7days', child: Text('Last 7 days')),
                            DropdownMenuItem(value: '30days', child: Text('Last 30 days')),
                          ],
                          onChanged: (value) {},
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(24),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: DropdownButtonFormField<SortBy>(
                          value: sortBy,
                          items: [
                            DropdownMenuItem(
                              value: SortBy.newest,
                              child: const Text('Newest'),
                            ),
                            DropdownMenuItem(
                              value: SortBy.oldest,
                              child: const Text('Oldest'),
                            ),
                            DropdownMenuItem(
                              value: SortBy.highestDb,
                              child: const Text('Highest dB'),
                            ),
                          ],
                          onChanged: (value) {
                            if (value != null) {
                              setState(() => sortBy = value);
                            }
                          },
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Theme.of(context).colorScheme.surfaceVariant,
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(24),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Filter chips
                  Wrap(
                    spacing: 8,
                    children: ['Night', 'Day', 'Has audio', 'Last 7 days'].map((chip) {
                      final isSelected = filterChip == chip;
                      return FilterChip(
                        label: Text(chip),
                        selected: isSelected,
                        onSelected: (selected) {
                          setState(() => filterChip = selected ? chip : '');
                        },
                        backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
                        selectedColor: Theme.of(context).primaryColor.withOpacity(0.2),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 32),

                  // Logs list
                  ...mockLogs.skip(currentPage * pageSize).take(pageSize).map((log) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: CardContainer(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(log.title, style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 4),
                                    Text(
                                      '${DateFormat('MMM d, h:mm a').format(log.occurredAt)} • ${log.duration} min • ${log.peakDb} dB',
                                      style: Theme.of(context).textTheme.bodyMedium,
                                    ),
                                    const SizedBox(height: 8),
                                    Wrap(
                                      spacing: 6,
                                      children: (log.tags?.split(', ') ?? []).map((tag) {
                                        return Chip(
                                          label: Text(tag, style: const TextStyle(fontSize: 12)),
                                          padding: EdgeInsets.zero,
                                          labelPadding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                          backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
                                        );
                                      }).toList(),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.open_in_new),
                                    onPressed: () => context.go('/log/${log.id}'),
                                    tooltip: 'Open',
                                  ),
                                  if (log.hasAudio)
                                    IconButton(
                                      icon: const Icon(Icons.download),
                                      onPressed: () {},
                                      tooltip: 'Download audio',
                                    ),
                                  IconButton(
                                    icon: const Icon(Icons.delete_outline),
                                    onPressed: () {
                                      _showConfirmDialog(
                                        context,
                                        'Delete this log?',
                                        'This action cannot be undone.',
                                        () {},
                                      );
                                    },
                                    tooltip: 'Delete',
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),

                  const SizedBox(height: 32),

                  // Pagination
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.chevron_left),
                        onPressed: currentPage > 0 ? () => setState(() => currentPage--) : null,
                      ),
                      Text('Page ${currentPage + 1} of ${(mockLogs.length / pageSize).ceil()}'),
                      IconButton(
                        icon: const Icon(Icons.chevron_right),
                        onPressed: currentPage < (mockLogs.length / pageSize).ceil() - 1
                            ? () => setState(() => currentPage++)
                            : null,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _showConfirmDialog(BuildContext context, String title, String message, VoidCallback onConfirm) {
    showDialog(
      context: context,
      builder: (context) => ConfirmDialog(
        title: title,
        message: message,
        confirmLabel: 'Delete',
        onConfirm: onConfirm,
      ),
    );
  }
}

class LogDetailPage extends StatefulWidget {
  final String logId;

  const LogDetailPage({required this.logId, Key? key}) : super(key: key);

  @override
  State<LogDetailPage> createState() => _LogDetailPageState();
}

class _LogDetailPageState extends State<LogDetailPage> {
  late TextEditingController notesController;

  final log = LogEntry(
    id: '1',
    title: 'Loud music from next door',
    occurredAt: DateTime.now().subtract(const Duration(hours: 2)),
    duration: 45,
    peakDb: 87,
    locationText: 'Living room',
    notesPreview: 'Very loud music, couldn\'t sleep',
    hasAudio: true,
    notes: 'Music started at 11 PM and continued for 45 minutes. Bass was very loud and prevented sleep. This is the third incident this week.',
    tags: 'Night, Music',
  );

  @override
  void initState() {
    super.initState();
    notesController = TextEditingController(text: log.notes);
  }

  @override
  Widget build(BuildContext context) {
    final appState = MockAppState();
    final isMobile = MediaQuery.of(context).size.width < 800;

    return AppScaffold(
      currentPage: 'Logs',
      child: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1120),
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Left column
                  Expanded(
                    flex: 2,
                    child: Column(
                      children: [
                        // Main info card
                        CardContainer(
                          child: Padding(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(log.title, style: Theme.of(context).textTheme.headlineSmall),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Expanded(
                                      child: _InfoRow(
                                        label: 'Date & time',
                                        value: DateFormat('MMM d, yyyy • h:mm a').format(log.occurredAt),
                                        context: context,
                                      ),
                                    ),
                                    Expanded(
                                      child: _InfoRow(
                                        label: 'Duration',
                                        value: '${log.duration} minutes',
                                        context: context,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Expanded(
                                      child: _InfoRow(
                                        label: 'Location',
                                        value: log.locationText,
                                        context: context,
                                      ),
                                    ),
                                    Expanded(
                                      child: _InfoRow(
                                        label: 'Peak dB',
                                        value: '${log.peakDb} dB',
                                        context: context,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Audio panel
                        if (log.hasAudio)
                          CardContainer(
                            child: Padding(
                              padding: const EdgeInsets.all(24),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Audio evidence', style: Theme.of(context).textTheme.headlineSmall),
                                  const SizedBox(height: 16),
                                  Container(
                                    height: 80,
                                    decoration: BoxDecoration(
                                      color: Theme.of(context).colorScheme.surfaceVariant,
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Center(
                                      child: Icon(
                                        Icons.waves,
                                        size: 40,
                                        color: Theme.of(context).primaryColor,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    children: [
                                      PillButton(
                                        label: 'Play',
                                        onPressed: () {},
                                        primary: true,
                                        compact: true,
                                      ),
                                      const SizedBox(width: 12),
                                      PillButton(
                                        label: 'Download',
                                        onPressed: () {},
                                        primary: false,
                                        compact: true,
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 24),

                  // Right column
                  Expanded(
                    child: Column(
                      children: [
                        // Notes card
                        CardContainer(
                          child: Padding(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Notes', style: Theme.of(context).textTheme.headlineSmall),
                                const SizedBox(height: 16),
                                TextField(
                                  controller: notesController,
                                  maxLines: 6,
                                  decoration: InputDecoration(
                                    filled: true,
                                    fillColor: Theme.of(context).colorScheme.surfaceVariant,
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(16),
                                      borderSide: BorderSide.none,
                                    ),
                                    hintText: 'Add notes about this incident...',
                                    contentPadding: const EdgeInsets.all(12),
                                  ),
                                ),
                                const SizedBox(height: 12),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: PillButton(
                                    label: 'Save notes',
                                    onPressed: () {},
                                    primary: true,
                                    compact: true,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Evidence card
                        CardContainer(
                          child: Padding(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Export evidence', style: Theme.of(context).textTheme.headlineSmall),
                                const SizedBox(height: 16),
                                if (appState.currentPlan == PlanTier.free)
                                  Text(
                                    'Upgrade to Plus to export this log as evidence.',
                                    style: Theme.of(context).textTheme.bodyMedium,
                                  )
                                else if (appState.currentPlan == PlanTier.plus)
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'PDF export is available in Pro only.',
                                        style: Theme.of(context).textTheme.bodyMedium,
                                      ),
                                      const SizedBox(height: 12),
                                      PillButton(
                                        label: 'Upgrade to Pro',
                                        onPressed: () => context.go('/upgrade'),
                                        primary: true,
                                        compact: true,
                                      ),
                                    ],
                                  )
                                else
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      PillButton(
                                        label: 'Generate Council PDF',
                                        onPressed: () {},
                                        primary: true,
                                        fullWidth: true,
                                      ),
                                      const SizedBox(height: 12),
                                      PillButton(
                                        label: 'Export ZIP (Audio + Notes)',
                                        onPressed: () {},
                                        primary: false,
                                        fullWidth: true,
                                      ),
                                    ],
                                  ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Delete button
                        if (appState.currentPlan != PlanTier.free)
                          SizedBox(
                            width: double.infinity,
                            child: PillButton(
                              label: 'Delete log',
                              onPressed: () {
                                showDialog(
                                  context: context,
                                  builder: (context) => ConfirmDialog(
                                    title: 'Delete this log?',
                                    message: 'This action cannot be undone.',
                                    confirmLabel: 'Delete',
                                    isDestructive: true,
                                    onConfirm: () {
                                      context.go('/logs');
                                    },
                                  ),
                                );
                              },
                              primary: false,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String label;
  final String value;
  final BuildContext context;

  const _InfoRow({
    required this.label,
    required this.value,
    required this.context,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: Theme.of(context).textTheme.bodyMedium),
        const SizedBox(height: 4),
        Text(value, style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
      ],
    );
  }
}

class AccountPage extends StatefulWidget {
  const AccountPage({Key? key}) : super(key: key);

  @override
  State<AccountPage> createState() => _AccountPageState();
}

class _AccountPageState extends State<AccountPage> {
  bool emailNotifications = true;
  bool reminders = true;

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      currentPage: 'Account',
      child: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 800),
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Account settings', style: Theme.of(context).textTheme.displayMedium),
                  const SizedBox(height: 32),

                  // Profile section
                  CardContainer(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Profile', style: Theme.of(context).textTheme.headlineSmall),
                          const SizedBox(height: 24),
                          Row(
                            children: [
                              Container(
                                width: 80,
                                height: 80,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: Theme.of(context).primaryColor.withOpacity(0.2),
                                ),
                                child: Icon(
                                  Icons.person,
                                  size: 40,
                                  color: Theme.of(context).primaryColor,
                                ),
                              ),
                              const SizedBox(width: 24),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('John Doe', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                    const SizedBox(height: 4),
                                    Text('john@example.com', style: Theme.of(context).textTheme.bodyMedium),
                                    const SizedBox(height: 16),
                                    Row(
                                      children: [
                                        PillButton(
                                          label: 'Change photo',
                                          onPressed: () {},
                                          primary: true,
                                          compact: true,
                                        ),
                                        const SizedBox(width: 8),
                                        PillButton(
                                          label: 'Edit name',
                                          onPressed: () {},
                                          primary: false,
                                          compact: true,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          const Divider(),
                          const SizedBox(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Email address', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  Text('john@example.com', style: Theme.of(context).textTheme.bodyMedium),
                                ],
                              ),
                              PillButton(
                                label: 'Change',
                                onPressed: () {},
                                primary: false,
                                compact: true,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Security section
                  CardContainer(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Security', style: Theme.of(context).textTheme.headlineSmall),
                          const SizedBox(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Password', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  Text('Last changed 3 months ago', style: Theme.of(context).textTheme.bodyMedium),
                                ],
                              ),
                              PillButton(
                                label: 'Change password',
                                onPressed: () {},
                                primary: false,
                                compact: true,
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          const Divider(),
                          const SizedBox(height: 24),
                          PillButton(
                            label: 'Sign out everywhere',
                            onPressed: () {},
                            primary: false,
                            fullWidth: true,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Notifications section
                  CardContainer(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Notifications', style: Theme.of(context).textTheme.headlineSmall),
                          const SizedBox(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Email notifications', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  Text('Get updates about your logs and submissions', style: Theme.of(context).textTheme.bodyMedium),
                                ],
                              ),
                              Switch(
                                value: emailNotifications,
                                onChanged: (value) => setState(() => emailNotifications = value),
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Reminders', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 4),
                                  Text('Daily reminders to log new incidents', style: Theme.of(context).textTheme.bodyMedium),
                                ],
                              ),
                              Switch(
                                value: reminders,
                                onChanged: (value) => setState(() => reminders = value),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class UpgradePage extends StatelessWidget {
  const UpgradePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = MockAppState();

    return AppScaffold(
      currentPage: 'Upgrade',
      child: SingleChildScrollView(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1120),
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text('Choose your plan', style: Theme.of(context).textTheme.displayMedium),
                  const SizedBox(height: 8),
                  Text(
                    'Manage noise evidence like a council pro',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 48),

                  // Pricing cards
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: _PricingCard(
                          tier: PlanTier.free,
                          title: 'Free',
                          monthlyPrice: 'Free',
                          yearlyPrice: 'Free',
                          description: 'Basic mobile logging',
                          features: [
                            'Mobile logging',
                            'Basic history on mobile',
                            '3 PDF exports/month',
                            'No web access',
                          ],
                          currentPlan: appState.currentPlan,
                          onSelect: () => appState.currentPlan = PlanTier.free,
                          isPopular: false,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _PricingCard(
                          tier: PlanTier.plus,
                          title: 'Plus',
                          monthlyPrice: '£3.99',
                          monthlyAlt: 'from €4.99 / \$4.99',
                          yearlyPrice: '£39.90',
                          yearlyAlt: 'from €49.90 / \$49.90',
                          description: 'Web management & audio',
                          features: [
                            'Web log viewing',
                            'Audio downloads',
                            'Edit notes & delete logs',
                            'Priority support',
                            'No PDF exports',
                          ],
                          currentPlan: appState.currentPlan,
                          onSelect: () => appState.currentPlan = PlanTier.plus,
                          isPopular: true,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _PricingCard(
                          tier: PlanTier.pro,
                          title: 'Pro',
                          monthlyPrice: '£7.99',
                          monthlyAlt: 'from €9.99 / \$9.99',
                          yearlyPrice: '£79.90',
                          yearlyAlt: 'from €99.90 / \$99.90',
                          description: 'Standardized exports',
                          features: [
                            'Everything in Plus',
                            'Council PDF exports',
                            'ZIP bundle export',
                            'Unlimited exports',
                            'Advanced templates',
                            'AI classification (coming soon)',
                          ],
                          currentPlan: appState.currentPlan,
                          onSelect: () => appState.currentPlan = PlanTier.pro,
                          isPopular: false,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 48),

                  // Billing note
                  Text(
                    'Yearly billing saves you 2 months worth of fees. All plans include 30-day free trial.',
                    style: Theme.of(context).textTheme.bodyMedium,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _PricingCard extends StatefulWidget {
  final PlanTier tier;
  final String title;
  final String monthlyPrice;
  final String? monthlyAlt;
  final String yearlyPrice;
  final String? yearlyAlt;
  final String description;
  final List<String> features;
  final PlanTier currentPlan;
  final VoidCallback onSelect;
  final bool isPopular;

  const _PricingCard({
    required this.tier,
    required this.title,
    required this.monthlyPrice,
    this.monthlyAlt,
    required this.yearlyPrice,
    this.yearlyAlt,
    required this.description,
    required this.features,
    required this.currentPlan,
    required this.onSelect,
    required this.isPopular,
  });

  @override
  State<_PricingCard> createState() => _PricingCardState();
}

class _PricingCardState extends State<_PricingCard> {
  bool isYearly = false;

  @override
  Widget build(BuildContext context) {
    final isCurrent = widget.currentPlan == widget.tier;

    return CardContainer(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.isPopular)
              Chip(
                label: const Text('Most popular'),
                backgroundColor: Theme.of(context).primaryColor.withOpacity(0.2),
                labelStyle: TextStyle(color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold),
              )
            else
              const SizedBox.shrink(),
            if (widget.isPopular) const SizedBox(height: 12),
            Text(widget.title, style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: 4),
            Text(widget.description, style: Theme.of(context).textTheme.bodyMedium),
            const SizedBox(height: 20),
            Row(
              children: [
                Text(isYearly ? widget.yearlyPrice : widget.monthlyPrice, style: Theme.of(context).textTheme.displaySmall?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                Text(isYearly ? '/year' : '/month', style: Theme.of(context).textTheme.bodyMedium),
              ],
            ),
            if (isYearly && widget.yearlyAlt != null)
              Text(widget.yearlyAlt!, style: Theme.of(context).textTheme.bodySmall)
            else if (!isYearly && widget.monthlyAlt != null)
              Text(widget.monthlyAlt!, style: Theme.of(context).textTheme.bodySmall),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: PillButton(
                label: isCurrent ? 'Current plan' : 'Upgrade',
                onPressed: isCurrent ? null : widget.onSelect,
                primary: widget.isPopular,
              ),
            ),
            const SizedBox(height: 24),
            const Divider(),
            const SizedBox(height: 24),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: widget.features.map((feature) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      Icon(Icons.check, size: 18, color: Theme.of(context).primaryColor),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(feature, style: Theme.of(context).textTheme.bodyMedium),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }
}

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

class AppScaffold extends StatelessWidget {
  final String currentPage;
  final Widget child;

  const AppScaffold({
    required this.currentPage,
    required this.child,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final appState = MockAppState();

    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        foregroundColor: Theme.of(context).textTheme.bodyLarge?.color,
        title: Text('Noise Mate', style: Theme.of(context).textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.bold)),
        centerTitle: false,
        actions: [
          Row(
            children: [
              TextButton(onPressed: () => context.go('/dashboard'), child: const Text('Dashboard')),
              const SizedBox(width: 8),
              TextButton(onPressed: () => context.go('/logs'), child: const Text('Logs')),
              const SizedBox(width: 8),
              TextButton(onPressed: () => context.go('/account'), child: const Text('Account')),
              const SizedBox(width: 24),
              PlanBadge(tier: appState.currentPlan),
              const SizedBox(width: 12),
              PillButton(
                label: 'Upgrade',
                onPressed: () => context.go('/upgrade'),
                primary: false,
                compact: true,
              ),
              const SizedBox(width: 12),
              // Account dropdown
              PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'account') {
                    context.go('/account');
                  } else if (value == 'signout') {
                    appState.isLoggedIn = false;
                    appState.triggerRebuild();
                    context.go('/login');
                  }
                },
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'account',
                    child: Row(
                      children: [
                        Icon(Icons.person, size: 18),
                        SizedBox(width: 8),
                        Text('Account Settings'),
                      ],
                    ),
                  ),
                  const PopupMenuDivider(),
                  const PopupMenuItem(
                    value: 'signout',
                    child: Row(
                      children: [
                        Icon(Icons.logout, size: 18),
                        SizedBox(width: 8),
                        Text('Sign out'),
                      ],
                    ),
                  ),
                ],
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: Theme.of(context).colorScheme.surfaceVariant,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Theme.of(context).primaryColor.withOpacity(0.2),
                        ),
                        child: Icon(Icons.person, size: 16, color: Theme.of(context).primaryColor),
                      ),
                      const SizedBox(width: 8),
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('John Doe', style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold)),
                          Text('john@example.com', style: Theme.of(context).textTheme.bodySmall?.copyWith(fontSize: 10)),
                        ],
                      ),
                      const SizedBox(width: 8),
                      Icon(Icons.expand_more, size: 16, color: Theme.of(context).textTheme.bodyMedium?.color),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
              // Dev theme toggle
              GestureDetector(
                onTap: () {
                  appState.isDarkMode = !appState.isDarkMode;
                  appState.triggerRebuild();
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Theme.of(context).primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        appState.isDarkMode ? Icons.dark_mode : Icons.light_mode,
                        size: 16,
                        color: Theme.of(context).primaryColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Dev',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),
            ],
          ),
        ],
      ),
      body: child,
    );
  }
}

class PillButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool primary;
  final bool fullWidth;
  final bool compact;

  const PillButton({
    required this.label,
    required this.onPressed,
    this.primary = true,
    this.fullWidth = false,
    this.compact = false,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final buttonStyle = ElevatedButton.styleFrom(
      backgroundColor: primary ? Theme.of(context).primaryColor : Theme.of(context).colorScheme.surfaceVariant,
      foregroundColor: primary ? Colors.white : Theme.of(context).textTheme.bodyLarge?.color,
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 16 : 24,
        vertical: compact ? 8 : 12,
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      elevation: 0,
      disabledBackgroundColor: Theme.of(context).colorScheme.surfaceVariant.withOpacity(0.5),
    );

    final widget = ElevatedButton(
      onPressed: onPressed,
      style: buttonStyle,
      child: Text(
        label,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: compact ? 12 : 14,
        ),
      ),
    );

    if (fullWidth) {
      return SizedBox(width: double.infinity, child: widget);
    }
    return widget;
  }
}

class PillInput extends StatelessWidget {
  final String label;
  final String hint;
  final TextEditingController controller;
  final bool obscure;

  const PillInput({
    required this.label,
    required this.hint,
    required this.controller,
    this.obscure = false,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label.isNotEmpty)
          Text(label, style: Theme.of(context).textTheme.bodyMedium)
        else
          const SizedBox.shrink(),
        if (label.isNotEmpty) const SizedBox(height: 8),
        TextField(
          controller: controller,
          obscureText: obscure,
          decoration: InputDecoration(
            filled: true,
            fillColor: Theme.of(context).colorScheme.surfaceVariant,
            hintText: hint,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(24),
              borderSide: BorderSide.none,
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          ),
        ),
      ],
    );
  }
}

class CardContainer extends StatelessWidget {
  final Widget child;
  final double borderRadius;

  const CardContainer({
    required this.child,
    this.borderRadius = 28,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).colorScheme.surface,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: Theme.of(context).primaryColor.withOpacity(0.1),
          width: 1,
        ),
      ),
      child: child,
    );
  }
}

class PlanBadge extends StatelessWidget {
  final PlanTier tier;

  const PlanBadge({required this.tier, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final tierName = tier.name[0].toUpperCase() + tier.name.substring(1);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: Theme.of(context).primaryColor.withOpacity(0.2),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        tierName,
        style: TextStyle(
          color: Theme.of(context).primaryColor,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }
}

class GateScreen extends StatelessWidget {
  final String title;
  final String subtitle;
  final String buttonLabel;
  final VoidCallback onPressed;
  final IconData icon;

  const GateScreen({
    required this.title,
    required this.subtitle,
    required this.buttonLabel,
    required this.onPressed,
    required this.icon,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: Theme.of(context).primaryColor),
          const SizedBox(height: 24),
          Text(title, style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 12),
          Text(subtitle, style: Theme.of(context).textTheme.bodyMedium, textAlign: TextAlign.center),
          const SizedBox(height: 32),
          PillButton(
            label: buttonLabel,
            onPressed: onPressed,
            primary: true,
          ),
        ],
      ),
    );
  }
}

class ConfirmDialog extends StatelessWidget {
  final String title;
  final String message;
  final String confirmLabel;
  final String cancelLabel;
  final bool isDestructive;
  final VoidCallback onConfirm;

  const ConfirmDialog({
    required this.title,
    required this.message,
    required this.confirmLabel,
    this.cancelLabel = 'Cancel',
    this.isDestructive = false,
    required this.onConfirm,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text(title),
      content: Text(message),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: Text(cancelLabel),
        ),
        ElevatedButton(
          onPressed: () {
            onConfirm();
            Navigator.pop(context);
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: isDestructive ? Colors.red : Theme.of(context).primaryColor,
            foregroundColor: Colors.white,
          ),
          child: Text(confirmLabel),
        ),
      ],
    );
  }
}

// ============================================================================
// APP STATE HELPER
// ============================================================================

// AppState is managed through MockAppState singleton above
