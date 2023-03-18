<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">


<xsl:template name="browser-tree">
	<xsl:for-each select="./*">
		<!-- <xsl:sort order="ascending" select="@i"/>
		<xsl:sort order="ascending" select="@name"/> -->
		<div class="leaf">
			<xsl:if test="@_id">
				<xsl:attribute name="data-id"><xsl:value-of select="@_id"/></xsl:attribute>
			</xsl:if>
			<i class="icon-folder">
				<xsl:if test="@i">
					<xsl:attribute name="class">icon-audio</xsl:attribute>
				</xsl:if>
			</i>
			<span><xsl:value-of select="@name"/></span>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="track-lanes">
	<xsl:for-each select="./Tracks/Track">
		<div class="lane" style="--c: #77c;">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="style">
				<xsl:if test="@color">--c: <xsl:value-of select="@color"/></xsl:if>
			</xsl:attribute>
			<xsl:if test="@class">
				<xsl:attribute name="class">lane <xsl:value-of select="@class"/></xsl:attribute>
			</xsl:if>
			<xsl:for-each select="./Lane/Clip">
				<b>
					<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="style">
						--x: <xsl:value-of select="@x"/>;
						--w: <xsl:value-of select="@w"/>;
					</xsl:attribute>
					<i><xsl:value-of select="@name"/></i>
				</b>
			</xsl:for-each>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="track-mixers">
	<xsl:for-each select="./Tracks/Track">
		<div class="lane">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="style">
				<xsl:if test="@color">--c: <xsl:value-of select="@color"/></xsl:if>
			</xsl:attribute>
			<xsl:if test="@class">
				<xsl:attribute name="class">lane <xsl:value-of select="@class"/></xsl:attribute>
			</xsl:if>
			<div class="mix-head">
				<span class="lane-toggler" data-click="toggle-lane"></span>
				<div class="title"><xsl:value-of select="@name"/></div>
			</div>
			<div class="mix-body"></div>
			<div class="mix-foot">
				<div class="track-btn activator" data-click="track-activator">
					<xsl:if test="@io-label">
						<xsl:attribute name="data-label"><xsl:value-of select="@io-label"/></xsl:attribute>
					</xsl:if>
				</div>
				<div class="track-btn solo" data-click="track-solo">S</div>
				<div class="track-btn record" data-click="track-record">&#9679;</div>
				<div class="vol-analyser">
					<canvas width="5" height="5"></canvas>
				</div>
			</div>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="io-track-lanes">
	<xsl:for-each select="./IoMaster/Track">
		<div class="lane collapsed">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="io-track-mixers">
	<xsl:for-each select="./IoMaster/Track">
		<div class="lane collapsed">
			<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
			<xsl:attribute name="style">
				<xsl:if test="@color">--c: <xsl:value-of select="@color"/></xsl:if>
			</xsl:attribute>
			<xsl:if test="@class">
				<xsl:attribute name="class">lane <xsl:value-of select="@class"/></xsl:attribute>
			</xsl:if>
			<div class="mix-head">
				<span class="lane-toggler" data-click="toggle-lane"></span>
				<div class="title"><xsl:value-of select="@name"/></div>
			</div>
			<div class="mix-body"></div>
			<div class="mix-foot">
				<xsl:if test="@id != 'master'">
					<div class="track-btn activator" data-click="track-activator">
						<xsl:if test="@io-label">
							<xsl:attribute name="data-label"><xsl:value-of select="@io-label"/></xsl:attribute>
						</xsl:if>
					</div>
					<div class="track-btn solo" data-click="track-solo">S</div>
					<div class="track-btn record" data-click="track-record">&#9679;</div>
				</xsl:if>
				<div class="vol-analyser">
					<canvas width="5" height="5"></canvas>
				</div>
			</div>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="file-tracks">
	<xsl:for-each select="./Tracks/Track">
		<xsl:call-template name="session-track" />
	</xsl:for-each>
</xsl:template>


<xsl:template name="file-io">
	<xsl:for-each select="./IoMaster/Track">
		<xsl:call-template name="session-track" />
	</xsl:for-each>
</xsl:template>


<xsl:template name="session-track">
	<div class="track">
		<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
		<xsl:if test="@class">
			<xsl:attribute name="class">track <xsl:value-of select="@class"/></xsl:attribute>
		</xsl:if>
		<xsl:attribute name="style">
			<xsl:if test="@color">--c: <xsl:value-of select="@color"/>;</xsl:if>
		</xsl:attribute>
		<div class="title"><xsl:value-of select="@name"/></div>
		<div class="slots">
			<xsl:for-each select="./Slot/Clip">
				<b>
					<xsl:attribute name="data-id"><xsl:value-of select="@id"/></xsl:attribute>
					<xsl:attribute name="style">--r: <xsl:value-of select="@row"/>;</xsl:attribute>
					<xsl:value-of select="@name"/>
				</b>
			</xsl:for-each>
		</div>
		<div class="status">
			<xsl:if test="not(@io-label)">
				<i class="btn-stop" data-click="track-stop"></i>
			</xsl:if>
			<xsl:if test="not(@io-label) and @id != 'master'">
				<i class="pie-playing on1" style="--duration: 2s;"></i>
			</xsl:if>
		</div>
		<div class="io"></div>
		<div class="sends" data-name="Sends">
			<xsl:if test="count(./Sends) = 0"><xsl:attribute name="data-name"></xsl:attribute></xsl:if>
			<xsl:for-each select="./Sends">
				<div class="knob">
					<xsl:attribute name="data-label"><xsl:value-of select="@label"/></xsl:attribute>
					<xsl:attribute name="data-value"><xsl:value-of select="@value"/></xsl:attribute>
				</div>
			</xsl:for-each>
		</div>
		<div class="mixer">
			<div>
				<div class="pan-knob" data-value="0"><div></div></div>
				<xsl:if test="@id != 'master'">
					<div class="track-btn activator" data-click="track-activator">
						<xsl:if test="@io-label">
							<xsl:attribute name="data-label"><xsl:value-of select="@io-label"/></xsl:attribute>
						</xsl:if>
					</div>
					<div class="track-btn solo" data-click="track-solo">S</div>
					<xsl:if test="not(@io-label)">
						<div class="track-btn record" data-click="track-record">
							<xsl:if test="./Buttons[@record = 'on']"><xsl:attribute name="class">track-btn record active</xsl:attribute></xsl:if>
							&#9679;
						</div>
					</xsl:if>
				</xsl:if>
			</div>
			<div class="volume">
				<xsl:attribute name="style">--vol: <xsl:value-of select="Volume/@value"/>%;</xsl:attribute>
				<div></div>
				<canvas width="6" height="111"></canvas>
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="midi-notes">
	<xsl:for-each select="./b">
		<b>
			<xsl:attribute name="style">
				--y: <xsl:value-of select="@y"/>;
				--x: <xsl:value-of select="@b"/>;
				--w: <xsl:value-of select="@w"/>;
				<xsl:if test="@s">transform: translateX(<xsl:value-of select="@s"/>px);</xsl:if>
			</xsl:attribute>
			<!-- <xsl:value-of select="@n"/> -->
		</b>
	</xsl:for-each>
</xsl:template>


<xsl:template name="midi-note-volume">
	<xsl:for-each select="./b">
		<b>
			<xsl:attribute name="style">
				--x: <xsl:value-of select="@b"/>;
				--v: <xsl:value-of select="@v"/>;
			</xsl:attribute>
		</b>
	</xsl:for-each>
</xsl:template>


<xsl:template name="devices">
	<xsl:choose>
		<xsl:when test="@type = 'drumkit'">
			<xsl:call-template name="rack-drumkit" />
		</xsl:when>
		<xsl:when test="@type = 'synth'">
			<xsl:call-template name="rack-synth" />
		</xsl:when>
		<xsl:when test="@type = 'sampler'">
			<xsl:call-template name="rack-sampler" />
		</xsl:when>
	</xsl:choose>
</xsl:template>


<xsl:template name="rack-synth">
	<div class="rack-body">
		<div class="rack-head">
			<i class="icon-blank"></i> <xsl:value-of select="./Device/@name"/>
		</div>
		<div class="box-body">
			<div class="synth-controls">
				<xsl:call-template name="device-controls" />
			</div>
			<!--
			context : BaseContext
			modulation : OmniOscillatorSynthOptions
			oscillator : OmniOscillatorSynthOptions
			onsilence : onSilenceCallback
			harmonicity : Positive
			-->
		</div>
	</div>
</xsl:template>


<xsl:template name="rack-sampler">
	<div class="rack-body">
		<div class="rack-head">
			<i class="icon-blank"></i> <xsl:value-of select="./Device/@name"/>
		</div>
		<div class="box-body">
			<div class="synth-controls">
				<xsl:call-template name="device-controls" />
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="rack-drumkit">
	<div class="rack-body">
		<div class="rack-head">
			<i class="icon-blank"></i> <xsl:value-of select="./Device/@name"/>
		</div>
		<div class="box-body">
			<div class="drum-control">
				<xsl:call-template name="device-controls" />
			</div>

			<div class="pads">
				<div class="pad-matrix">
					<div class="selection"></div>
				</div>
				<div class="pads-wrapper">
					<ul class="pad-list disable-mute1">
					<xsl:for-each select="./Device/Pads/Pad">
						<xsl:call-template name="drum-pad" />
					</xsl:for-each>
					</ul>
				</div>
			</div>
		</div>
	</div>
</xsl:template>


<xsl:template name="device-controls">
	<ul class="col-4 controls">
		<xsl:for-each select="./Device/Settings/Knob">
		<li>
			<span class="ctrl-name"><xsl:value-of select="@name"/></span>
			<div class="knob ctrl-knob">
				<xsl:attribute name="data-value"><xsl:value-of select="@value"/></xsl:attribute>
			</div>
			<span class="ctrl-value"><xsl:value-of select="@value"/> <xsl:value-of select="@suffix"/></span>
		</li>
		</xsl:for-each>
	</ul>
</xsl:template>


<xsl:template name="drum-pad">
	<li>
		<xsl:attribute name="data-key"><xsl:value-of select="@key"/></xsl:attribute>
		<xsl:choose>
			<xsl:when test="@sample">
				<span class="pad-name"><xsl:value-of select="@name"/></span>
				<i class="pad-mute" data-click="mute-pad">M</i>
				<i class="pad-play" data-click="play-pad">
					<xsl:attribute name="data-arg"><xsl:value-of select="@n"/></xsl:attribute>
				</i>
				<i class="pad-solo" data-click="solo-pad">S</i>
			</xsl:when>
			<xsl:otherwise>
				<xsl:attribute name="class">empty</xsl:attribute>
			</xsl:otherwise>
		</xsl:choose>
	</li>
</xsl:template>


<xsl:template name="clip-pads">
	<xsl:choose>
		<xsl:when test="../Device/Pads">
		<ol>
			<xsl:for-each select="../Device/Pads/Pad">
				<xsl:sort order="ascending" select="@kI"/>
				<xsl:if test="@sample">
					<li>
						<xsl:attribute name="data-key"><xsl:value-of select="@key"/></xsl:attribute>
						<xsl:attribute name="data-sample"><xsl:value-of select="@sample"/></xsl:attribute>
						<xsl:value-of select="@name"/>
					</li>
				</xsl:if>
			</xsl:for-each>
		</ol>
		</xsl:when>
		<xsl:otherwise>
			<ul>
				<li data-label="C7"></li>
				<li data-label="C6"></li>
				<li data-label="C5"></li>
				<li data-label="C4"></li>
				<li data-label="C3"></li>
				<li data-label="C2"></li>
				<li data-label="C1"></li>
				<li data-label="C0"></li>
				<li data-label="C-1"></li>
				<li data-label="C-2"></li>
			</ul>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>


</xsl:stylesheet>
