<section class="guide px-4 py-20 md:py-32 max-w-3xl mx-auto font-sans text-gray-300">

  <!-- What is AI? -->
  <div class="mb-16">
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">What is AI?</h2>
    <p class="leading-relaxed mb-4">
      AI — specifically large language models (LLMs) — are tools that understand and generate text.
      They've read enormous amounts of code and documentation, so they can help you write, debug, and
      reason about software.
    </p>
    <p class="leading-relaxed">
      Think of it as a very well-read pair programmer. You describe what you want, it writes the code.
      You review, iterate, and ship.
    </p>
  </div>

  <hr class="border-gray-800 mb-16" />

  <!-- Getting Started with Spec Kit -->
  <div class="mb-16">
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">Getting Started with Spec Kit</h2>
    <p class="leading-relaxed mb-4">
      <strong class="text-white">Spec-driven development</strong> means you write a short specification
      <em>before</em> you write code. The spec becomes the single source of truth — for you and for the AI.
    </p>

    <p class="leading-relaxed mb-4">Initialize a project with one command:</p>
    <div class="code-block">
      <code>specify init --here --ai claude</code>
    </div>

    <p class="leading-relaxed mb-4 mt-6">
      Then follow the slash-command workflow inside Claude Code:
    </p>
    <ol class="list-decimal list-inside space-y-2 ml-2">
      <li><code class="code-inline">/speckit.specify</code> — Write or refine your spec</li>
      <li><code class="code-inline">/speckit.plan</code> — Generate an implementation plan</li>
      <li><code class="code-inline">/speckit.tasks</code> — Break the plan into tasks</li>
      <li><code class="code-inline">/speckit.implement</code> — Execute tasks one by one</li>
    </ol>
  </div>

  <hr class="border-gray-800 mb-16" />

  <!-- Claude Code Essentials -->
  <div>
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-8">Claude Code Essentials</h2>

    <!-- CLAUDE.md -->
    <div class="mb-10">
      <h3 class="text-xl font-semibold text-white mb-3">CLAUDE.md</h3>
      <p class="leading-relaxed mb-3">
        A markdown file at the root of your project that tells Claude how your codebase works —
        conventions, stack details, do's and don'ts. It's the foundation of every session.
      </p>
      <div class="code-block">
        <code># CLAUDE.md{'\n'}Never use the `any` type.{'\n'}Always run tests before committing.</code>
      </div>
    </div>

    <!-- Context -->
    <div class="mb-10">
      <h3 class="text-xl font-semibold text-white mb-3">Context</h3>
      <p class="leading-relaxed">
        Claude reads your <strong class="text-white">codebase</strong> (files, directory structure),
        the <strong class="text-white">conversation history</strong>, and your
        <strong class="text-white">CLAUDE.md</strong> to build an understanding of the project.
        The more precise your context, the better the output.
      </p>
    </div>

    <!-- Sub agents -->
    <div class="mb-10">
      <h3 class="text-xl font-semibold text-white mb-3">Sub Agents / Teams</h3>
      <p class="leading-relaxed">
        Claude can delegate work to specialized agents —
        <code class="code-inline">Explore</code> for codebase research,
        <code class="code-inline">Plan</code> for architecture,
        <code class="code-inline">Bash</code> for shell commands, and more. They run in parallel
        when tasks are independent.
      </p>
    </div>

    <!-- Skills -->
    <div class="mb-10">
      <h3 class="text-xl font-semibold text-white mb-3">Skills</h3>
      <p class="leading-relaxed">
        Slash commands like <code class="code-inline">/commit</code> and
        <code class="code-inline">/review-pr</code> invoke built-in or custom skills.
        You can create your own skills to automate repetitive workflows.
      </p>
    </div>

    <!-- MCPs -->
    <div class="mb-10">
      <h3 class="text-xl font-semibold text-white mb-3">MCPs</h3>
      <p class="leading-relaxed">
        <strong class="text-white">Model Context Protocol</strong> servers extend Claude's capabilities —
        connect to databases, APIs, or any external service. Think of them as plugins that give Claude
        new tools to use.
      </p>
    </div>

    <!-- Hooks -->
    <div>
      <h3 class="text-xl font-semibold text-white mb-3">Hooks</h3>
      <p class="leading-relaxed">
        Shell commands that auto-trigger on Claude Code events. For example, run a linter every time
        a file is saved, or run tests after every code edit. They keep quality guardrails in place
        without manual effort.
      </p>
    </div>
  </div>

</section>

<style>
  .code-block {
    background-color: #111827;
    border: 1px solid #1f2937;
    border-radius: 0.375rem;
    padding: 0.75rem 1rem;
    overflow-x: auto;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
    font-size: 0.875rem;
    color: #e5e7eb;
    white-space: pre;
    line-height: 1.6;
  }

  .code-inline {
    background-color: #1f2937;
    border-radius: 0.25rem;
    padding: 0.125rem 0.375rem;
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace;
    font-size: 0.85em;
    color: #67e8f9;
  }
</style>
