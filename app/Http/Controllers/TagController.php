<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::latest()->get();

        return Inertia::render('tag/index', [
            'tags' => $tags,
        ]);
    }

    public function create()
    {
        return Inertia::render('tag/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $tags = Tag::create([
            'name' => $request->name,
            'user_id' => auth()->id(),
        ]);

        if (isset($request->transaction) && $request->transaction) {
            return back()->with([
                'success' => true,
                'tags' => $tags,
            ]);
        }

        return redirect()->route('tags.index');
    }

    public function edit($id)
    {
        $tag = Tag::findOrFail($id);
        return response()->json(['data' => $tag]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $tag = Tag::findOrFail($id);
        $tag->update([
            'name' => $request->name,
        ]);

        return redirect()->route('tags.index');
    }

    public function destroy($id)
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return redirect()->route('tags.index');
    }
}
