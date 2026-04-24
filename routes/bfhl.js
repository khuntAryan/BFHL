const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/bfhl", (req, res) => {
  const data = req.body.data || [];

  const validEdges = [];
  const invalid_entries = [];
  const duplicate_edges = [];
  const seen = new Set();

  for (let item of data) {
    item = item.trim();

    if (!/^[A-Z]->[A-Z]$/.test(item) || item[0] === item[3]) {
      invalid_entries.push(item);
      continue;
    }

    if (seen.has(item)) {
      if (!duplicate_edges.includes(item)) {
        duplicate_edges.push(item);
      }
      continue;
    }

    seen.add(item);
    validEdges.push(item);
  }


  const graph = {};
  const childSet = new Set();
  const nodes = new Set();

  for (let edge of validEdges) {
    const [p, c] = edge.split("->");
  
    if (!graph[p]) graph[p] = [];
    graph[p].push(c);
  
    childSet.add(c);
    nodes.add(p);
    nodes.add(c);
  }

  let roots = [...nodes].filter(n => !childSet.has(n));

  function buildTree(node, visited, stack) {
    if (stack.has(node)) return { cycle: true };
  
    stack.add(node);
  
    const children = graph[node] || [];
    let tree = {};
    let maxDepth = 1;
  
    for (let child of children) {
      if (stack.has(child)) {
        return { cycle: true }; 
      }
  
      if (visited.has(child)) continue;
  
      const res = buildTree(child, visited, stack);
  
      if (res.cycle) {
        return { cycle: true }; 
      }
  
      tree[child] = res.tree;
      maxDepth = Math.max(maxDepth, 1 + res.depth);
    }
  
    stack.delete(node);
    visited.add(node);
  
    return { tree, depth: maxDepth };
  }

  const hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;
  let largestDepth = 0;
  let largestRoot = "";

  const globalVisited = new Set();

  for (let root of roots) {
    if (globalVisited.has(root)) continue;

    const stack = new Set();
    const localVisited = new Set();

    const resDFS = buildTree(root, localVisited, stack);

    if (resDFS.cycle) {
      total_cycles++;

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });

      const stack2 = [root];

      while (stack2.length) {
        const curr = stack2.pop();

        if (globalVisited.has(curr)) continue;

        globalVisited.add(curr);

        const children = graph[curr] || [];
        for (let child of children) {
          if (!globalVisited.has(child)) {
            stack2.push(child);
          }
        }
      }

      continue;
    }
    total_trees++;

    if (
      resDFS.depth > largestDepth ||
      (resDFS.depth === largestDepth && root < largestRoot)
    ) {
      largestDepth = resDFS.depth;
      largestRoot = root;
    }

    hierarchies.push({
      root,
      tree: { [root]: resDFS.tree },
      depth: resDFS.depth
    });

    for (let node of localVisited) {
      globalVisited.add(node);
    }
  }

  for (let node of nodes) {
    if (!globalVisited.has(node)) {
      total_cycles++;

      hierarchies.push({
        root: node,
        tree: {},
        has_cycle: true
      });

      const stack = [node];

      while (stack.length) {
        const curr = stack.pop();

        if (globalVisited.has(curr)) continue;

        globalVisited.add(curr);

        const children = graph[curr] || [];
        for (let child of children) {
          if (!globalVisited.has(child)) {
            stack.push(child);
          }
        }
      }
    }
  }

  res.json({
    user_id: "aryankhunt_18012005",
    email_id: "ak7895@srmist.edu.in",
    college_roll_number: "RA2311029010056",
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root: largestRoot
    }
  });
});

module.exports = router;